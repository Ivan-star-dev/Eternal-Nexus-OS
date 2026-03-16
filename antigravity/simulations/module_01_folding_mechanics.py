"""
CHIP FOLD — MÓDULO 01: MECÂNICA DE DOBRAMENTO DE NANOFIBRILAS CNF
=================================================================
Simulação da mecânica de dobramento de nanofibrilas de celulose (CNF)
em ângulos críticos (30°, 45°, 60°, 90°) para formação de portas lógicas.

Modelo: Elastica de Kirchhoff para hastes elásticas finas
Referências:
  - Nogi et al., Adv. Mater. 2009 (propriedades mecânicas CNF)
  - Moon et al., Chem. Soc. Rev. 2011 (nanocelulose review)
  - Módulo de Young CNF: 100-140 GPa (experimental, USP 2024)

Autor: Framework para projeto Chip Fold
Data: Março 2026
"""

import numpy as np
from scipy.integrate import solve_ivp
from scipy.optimize import minimize_scalar
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')

# ============================================================
# CONSTANTES FÍSICAS E PARÂMETROS DA CNF
# ============================================================

class CNFProperties:
    """Propriedades físicas da nanofibrila de celulose."""
    
    # Dimensões típicas
    DIAMETER_NM = 5.0            # nm (faixa: 3-50 nm, usamos 5 nm para CNF de cabaço)
    LENGTH_UM = 10.0             # µm (faixa: 1-50 µm)
    DIAMETER_M = DIAMETER_NM * 1e-9
    LENGTH_M = LENGTH_UM * 1e-6
    RADIUS_M = DIAMETER_M / 2
    
    # Propriedades mecânicas
    YOUNGS_MODULUS_GPA = 120.0   # GPa (CNF cristalina, média experimental)
    YOUNGS_MODULUS_PA = YOUNGS_MODULUS_GPA * 1e9
    POISSONS_RATIO = 0.30        # Estimativa para celulose cristalina
    SHEAR_MODULUS_PA = YOUNGS_MODULUS_PA / (2 * (1 + POISSONS_RATIO))
    
    # Momento de inércia (seção circular)
    MOMENT_OF_INERTIA = np.pi * RADIUS_M**4 / 4  # m^4
    
    # Rigidez à flexão (EI)
    BENDING_STIFFNESS = YOUNGS_MODULUS_PA * MOMENT_OF_INERTIA  # N·m²
    
    # Tensão de ruptura
    TENSILE_STRENGTH_GPA = 7.5   # GPa (CNF cristalina, Saito et al. 2013)
    TENSILE_STRENGTH_PA = TENSILE_STRENGTH_GPA * 1e9
    
    # Densidade
    DENSITY_KG_M3 = 1500.0      # kg/m³ (celulose cristalina)
    
    # Propriedades térmicas
    THERMAL_CONDUCTIVITY = 1.0   # W/(m·K) (axial, CNF)
    SPECIFIC_HEAT = 1200.0       # J/(kg·K)
    DECOMPOSITION_TEMP_C = 260   # °C (início da degradação térmica)
    
    @classmethod
    def summary(cls):
        return {
            'diâmetro (nm)': cls.DIAMETER_NM,
            'comprimento (µm)': cls.LENGTH_UM,
            'módulo de Young (GPa)': cls.YOUNGS_MODULUS_GPA,
            'rigidez à flexão EI (N·m²)': cls.BENDING_STIFFNESS,
            'tensão de ruptura (GPa)': cls.TENSILE_STRENGTH_GPA,
            'densidade (kg/m³)': cls.DENSITY_KG_M3,
            'temp. decomposição (°C)': cls.DECOMPOSITION_TEMP_C,
        }


# ============================================================
# MODELO DE DOBRAMENTO — ELASTICA DE KIRCHHOFF
# ============================================================

class FoldingSimulation:
    """
    Simula o dobramento de uma nanofibrila CNF usando a teoria
    da Elastica de Kirchhoff para hastes finas.
    
    A curvatura κ ao longo da fibra determina o ângulo de dobra.
    Para dobramento uniforme: θ_total = κ * L_dobra
    
    Energia de dobramento: U = (EI/2) * ∫ κ² ds
    """
    
    def __init__(self, cnf=None):
        self.cnf = cnf or CNFProperties()
        self.results = {}
    
    def compute_bending_energy(self, target_angle_deg, bend_length_fraction=0.1):
        """
        Calcula a energia de dobramento para atingir um ângulo alvo.
        
        Args:
            target_angle_deg: ângulo de dobra desejado (graus)
            bend_length_fraction: fração do comprimento da fibra onde ocorre a dobra
        
        Returns:
            dict com energia, curvatura, tensão máxima, e viabilidade
        """
        theta = np.radians(target_angle_deg)
        L_bend = self.cnf.LENGTH_M * bend_length_fraction  # comprimento da zona de dobra
        
        # Curvatura uniforme na zona de dobra
        kappa = theta / L_bend  # 1/m
        
        # Raio de curvatura
        R_curvature = 1.0 / kappa if kappa > 0 else np.inf
        
        # Energia de dobramento (por fibra)
        U_bend = 0.5 * self.cnf.BENDING_STIFFNESS * kappa**2 * L_bend  # Joules
        
        # Tensão máxima na superfície (σ = E * r / R)
        sigma_max = self.cnf.YOUNGS_MODULUS_PA * self.cnf.RADIUS_M * kappa
        
        # Fator de segurança
        safety_factor = self.cnf.TENSILE_STRENGTH_PA / sigma_max if sigma_max > 0 else np.inf
        
        # Viabilidade
        viable = safety_factor > 1.5  # Fator mínimo de segurança
        
        return {
            'ângulo (°)': target_angle_deg,
            'curvatura κ (1/m)': kappa,
            'raio de curvatura (nm)': R_curvature * 1e9,
            'energia de dobra (eV)': U_bend / 1.602e-19,
            'energia de dobra (J)': U_bend,
            'tensão máxima (GPa)': sigma_max / 1e9,
            'tensão de ruptura (GPa)': self.cnf.TENSILE_STRENGTH_GPA,
            'fator de segurança': safety_factor,
            'viável': viable,
            'comprimento zona dobra (nm)': L_bend * 1e9,
        }
    
    def sweep_angles(self, angles=None, bend_fractions=None):
        """
        Varre múltiplos ângulos e frações de dobra para mapear
        o espaço de parâmetros viável.
        """
        if angles is None:
            angles = np.arange(5, 181, 5)
        if bend_fractions is None:
            bend_fractions = [0.05, 0.10, 0.15, 0.20]
        
        results = []
        for bf in bend_fractions:
            for ang in angles:
                r = self.compute_bending_energy(ang, bf)
                r['fração de dobra'] = bf
                results.append(r)
        
        self.results['sweep'] = results
        return results
    
    def critical_angles_analysis(self):
        """
        Análise detalhada dos quatro ângulos críticos do Chip Fold:
        30°, 45°, 60°, 90° — e do ângulo de torção NOT (180°).
        """
        critical = [30, 45, 60, 90, 180]
        analysis = {}
        
        for ang in critical:
            # Testar diferentes zonas de dobra para encontrar ótimo
            best = None
            for bf in np.linspace(0.03, 0.30, 100):
                r = self.compute_bending_energy(ang, bf)
                if r['viável']:
                    if best is None or r['energia de dobra (eV)'] < best['energia de dobra (eV)']:
                        best = r.copy()
                        best['fração de dobra ótima'] = bf
            
            if best is None:
                # Sem solução viável — reportar o menor stress
                best_stress = None
                for bf in np.linspace(0.03, 0.50, 200):
                    r = self.compute_bending_energy(ang, bf)
                    if best_stress is None or r['fator de segurança'] > best_stress['fator de segurança']:
                        best_stress = r.copy()
                        best_stress['fração de dobra ótima'] = bf
                best_stress['NOTA'] = 'ATENÇÃO: Não atinge fator de segurança > 1.5 em nenhuma configuração'
                analysis[ang] = best_stress
            else:
                analysis[ang] = best
        
        self.results['critical'] = analysis
        return analysis
    
    def elastica_shape(self, target_angle_deg, bend_fraction=0.10, n_points=500):
        """
        Calcula a forma 2D da fibra dobrada (curva da Elastica).
        Retorna coordenadas (x, y) ao longo da fibra.
        """
        theta_total = np.radians(target_angle_deg)
        L = self.cnf.LENGTH_M
        L_bend = L * bend_fraction
        L_straight_before = (L - L_bend) / 2
        L_straight_after = L - L_bend - L_straight_before
        
        s = np.linspace(0, L, n_points)
        x = np.zeros(n_points)
        y = np.zeros(n_points)
        theta = np.zeros(n_points)
        
        kappa = theta_total / L_bend
        
        for i in range(1, n_points):
            ds = s[i] - s[i-1]
            si = s[i]
            
            if si <= L_straight_before:
                # Segmento reto antes da dobra
                dtheta = 0
            elif si <= L_straight_before + L_bend:
                # Zona de dobra (curvatura uniforme)
                dtheta = kappa * ds
            else:
                # Segmento reto após a dobra
                dtheta = 0
            
            theta[i] = theta[i-1] + dtheta
            x[i] = x[i-1] + ds * np.cos(theta[i])
            y[i] = y[i-1] + ds * np.sin(theta[i])
        
        return {
            's': s * 1e6,  # µm
            'x': x * 1e6,  # µm
            'y': y * 1e6,  # µm
            'theta': np.degrees(theta),
            'angle': target_angle_deg,
        }


# ============================================================
# MODELO DE PORTA AND — INTERFERÊNCIA NO PONTO DE CONTATO
# ============================================================

class ANDGateModel:
    """
    Modela a porta AND por dobramento de duas fibras a 45°
    convergindo em um ponto de contato.
    
    O modelo trata a condução ao longo da fibra como onda 
    quasi-1D com dispersão afetada pelo ângulo de dobra.
    A interferência construtiva ocorre apenas quando ambas
    as fibras estão ativas (portadoras presentes em ambas).
    """
    
    def __init__(self, cnf=None):
        self.cnf = cnf or CNFProperties()
    
    def transmission_probability(self, angle_deg, energy_eV=0.1):
        """
        Calcula a probabilidade de transmissão de elétrons
        através de uma dobra de ângulo dado.
        
        Modelo simplificado: T = cos²(θ/2) * exp(-α*θ²)
        onde α depende da relação entre comprimento de onda de Broglie
        e raio de curvatura.
        
        Este é um modelo analítico de primeira ordem. Simulações DFT
        completas são necessárias para validação quantitativa.
        """
        theta = np.radians(angle_deg)
        
        # Comprimento de onda de de Broglie para elétron a energy_eV
        hbar = 1.055e-34  # J·s
        m_e = 9.109e-31   # kg
        E_J = energy_eV * 1.602e-19  # J
        k = np.sqrt(2 * m_e * E_J) / hbar  # 1/m
        lambda_dB = 2 * np.pi / k  # m
        
        # Raio de curvatura mínimo (para bend_fraction = 0.10)
        L_bend = self.cnf.LENGTH_M * 0.10
        R = L_bend / theta if theta > 0.01 else np.inf
        
        # Parâmetro de atenuação
        alpha = (lambda_dB / R)**0.5 if R > 0 and R < np.inf else 0
        
        # Transmissão
        T = np.cos(theta/2)**2 * np.exp(-alpha * theta**2)
        
        return {
            'ângulo (°)': angle_deg,
            'energia (eV)': energy_eV,
            'λ de Broglie (nm)': lambda_dB * 1e9,
            'transmissão T': T,
            'reflexão R': 1 - T,
        }
    
    def and_gate_output(self, input_A, input_B, angle=45.0, energy_eV=0.1):
        """
        Calcula a saída da porta AND.
        
        input_A, input_B: 0 ou 1 (presença de portadores)
        A saída é proporcional a T_A * T_B * fator_interferência
        """
        T_info = self.transmission_probability(angle, energy_eV)
        T = T_info['transmissão T']
        
        # Amplitude de cada fibra no ponto de contato
        amp_A = input_A * np.sqrt(T)
        amp_B = input_B * np.sqrt(T)
        
        # Interferência construtiva (fibras em fase quando ambas ativas)
        # Amplitude total: soma coerente
        amp_total = amp_A + amp_B
        
        # Intensidade (proporcional a |amplitude|²)
        intensity = amp_total**2
        
        # Threshold para lógica digital: metade da intensidade máxima
        threshold = 2 * T  # Ambas ativas = 4*T, limiar = 2*T
        output = 1 if intensity > threshold else 0
        
        return {
            'input_A': input_A,
            'input_B': input_B,
            'output': output,
            'intensidade': intensity,
            'threshold': threshold,
            'transmissão': T,
            'correto': output == (input_A and input_B),
        }
    
    def truth_table(self, angle=45.0, energy_eV=0.1):
        """Gera tabela verdade completa da porta AND."""
        inputs = [(0,0), (0,1), (1,0), (1,1)]
        table = []
        for a, b in inputs:
            result = self.and_gate_output(a, b, angle, energy_eV)
            table.append(result)
        return table


# ============================================================
# VISUALIZAÇÃO E RELATÓRIO
# ============================================================

def generate_full_report(output_dir='/home/claude/chipfold_sim/output'):
    """Gera relatório completo com figuras."""
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    cnf = CNFProperties()
    sim = FoldingSimulation(cnf)
    gate = ANDGateModel(cnf)
    
    print("=" * 70)
    print("CHIP FOLD — SIMULAÇÃO DE MECÂNICA DE DOBRAMENTO")
    print("=" * 70)
    
    # 1. Propriedades da CNF
    print("\n1. PROPRIEDADES DA NANOFIBRILA CNF")
    print("-" * 40)
    for k, v in cnf.summary().items():
        if isinstance(v, float):
            print(f"   {k}: {v:.6e}" if v < 1e-10 else f"   {k}: {v:.4f}")
        else:
            print(f"   {k}: {v}")
    
    # 2. Análise de ângulos críticos
    print("\n2. ANÁLISE DE ÂNGULOS CRÍTICOS")
    print("-" * 40)
    analysis = sim.critical_angles_analysis()
    for ang, data in analysis.items():
        print(f"\n   Ângulo: {ang}°")
        print(f"   Curvatura: {data['curvatura κ (1/m)']:.2e} 1/m")
        print(f"   Raio de curvatura: {data['raio de curvatura (nm)']:.1f} nm")
        print(f"   Energia de dobra: {data['energia de dobra (eV)']:.4f} eV")
        print(f"   Tensão máxima: {data['tensão máxima (GPa)']:.2f} GPa")
        print(f"   Fator de segurança: {data['fator de segurança']:.2f}")
        print(f"   Viável: {'SIM' if data['viável'] else 'NÃO'}")
        if 'NOTA' in data:
            print(f"   >>> {data['NOTA']}")
    
    # 3. Tabela verdade AND
    print("\n3. PORTA AND — TABELA VERDADE (45°)")
    print("-" * 40)
    tt = gate.truth_table(45.0, 0.1)
    all_correct = True
    for row in tt:
        status = "OK" if row['correto'] else "FALHA"
        print(f"   A={row['input_A']} B={row['input_B']} → OUT={row['output']} "
              f"(I={row['intensidade']:.4f}, T={row['threshold']:.4f}) [{status}]")
        if not row['correto']:
            all_correct = False
    print(f"\n   Verificação lógica: {'TODAS CORRETAS' if all_correct else 'ERROS DETECTADOS'}")
    
    # 4. Figuras
    # Fig 1: Formas das fibras dobradas
    fig1, axes1 = plt.subplots(2, 3, figsize=(15, 10))
    fig1.suptitle('Chip Fold — Formas de Fibras Dobradas (Elastica)', fontsize=14, fontweight='bold')
    
    critical_angles = [30, 45, 60, 90, 120, 180]
    for idx, ang in enumerate(critical_angles):
        ax = axes1[idx // 3][idx % 3]
        shape = sim.elastica_shape(ang, bend_fraction=0.10)
        ax.plot(shape['x'], shape['y'], 'b-', linewidth=2)
        ax.set_title(f'Dobra {ang}°', fontweight='bold')
        ax.set_xlabel('x (µm)')
        ax.set_ylabel('y (µm)')
        ax.set_aspect('equal')
        ax.grid(True, alpha=0.3)
    
    fig1.tight_layout()
    fig1.savefig(f'{output_dir}/fig01_folding_shapes.png', dpi=150, bbox_inches='tight')
    print(f"\n   [Figura salva: fig01_folding_shapes.png]")
    
    # Fig 2: Energia de dobra vs ângulo
    fig2, (ax2a, ax2b) = plt.subplots(1, 2, figsize=(14, 6))
    fig2.suptitle('Chip Fold — Energia e Tensão de Dobramento', fontsize=14, fontweight='bold')
    
    angles_sweep = np.arange(5, 181, 2)
    for bf in [0.05, 0.10, 0.15, 0.20]:
        energies = []
        stresses = []
        for a in angles_sweep:
            r = sim.compute_bending_energy(a, bf)
            energies.append(r['energia de dobra (eV)'])
            stresses.append(r['tensão máxima (GPa)'])
        ax2a.plot(angles_sweep, energies, label=f'f_dobra={bf:.0%}')
        ax2b.plot(angles_sweep, stresses, label=f'f_dobra={bf:.0%}')
    
    ax2a.set_xlabel('Ângulo de Dobra (°)')
    ax2a.set_ylabel('Energia de Dobra (eV)')
    ax2a.set_title('Energia vs Ângulo')
    ax2a.legend()
    ax2a.grid(True, alpha=0.3)
    
    ax2b.set_xlabel('Ângulo de Dobra (°)')
    ax2b.set_ylabel('Tensão Máxima (GPa)')
    ax2b.set_title('Tensão vs Ângulo')
    ax2b.axhline(y=cnf.TENSILE_STRENGTH_GPA, color='r', linestyle='--', label=f'Ruptura ({cnf.TENSILE_STRENGTH_GPA} GPa)')
    ax2b.legend()
    ax2b.grid(True, alpha=0.3)
    
    fig2.tight_layout()
    fig2.savefig(f'{output_dir}/fig02_energy_stress.png', dpi=150, bbox_inches='tight')
    print(f"   [Figura salva: fig02_energy_stress.png]")
    
    # Fig 3: Transmissão eletrônica vs ângulo
    fig3, (ax3a, ax3b) = plt.subplots(1, 2, figsize=(14, 6))
    fig3.suptitle('Chip Fold — Transmissão Eletrônica em Dobras', fontsize=14, fontweight='bold')
    
    angles_t = np.arange(1, 181, 1)
    for E_eV in [0.05, 0.10, 0.20, 0.50, 1.0]:
        T_vals = []
        for a in angles_t:
            r = gate.transmission_probability(a, E_eV)
            T_vals.append(r['transmissão T'])
        ax3a.plot(angles_t, T_vals, label=f'E={E_eV} eV')
    
    ax3a.set_xlabel('Ângulo de Dobra (°)')
    ax3a.set_ylabel('Probabilidade de Transmissão T')
    ax3a.set_title('Transmissão vs Ângulo (várias energias)')
    ax3a.legend()
    ax3a.grid(True, alpha=0.3)
    
    # Mapa de calor: Transmissão(ângulo, energia)
    E_range = np.linspace(0.01, 1.0, 100)
    A_range = np.linspace(1, 180, 180)
    T_map = np.zeros((len(E_range), len(A_range)))
    for i, E in enumerate(E_range):
        for j, A in enumerate(A_range):
            r = gate.transmission_probability(A, E)
            T_map[i, j] = r['transmissão T']
    
    im = ax3b.imshow(T_map, aspect='auto', origin='lower',
                     extent=[1, 180, 0.01, 1.0], cmap='viridis')
    ax3b.set_xlabel('Ângulo de Dobra (°)')
    ax3b.set_ylabel('Energia do Elétron (eV)')
    ax3b.set_title('Mapa de Transmissão T(θ, E)')
    plt.colorbar(im, ax=ax3b, label='T')
    
    # Marcar ângulos críticos
    for ang in [30, 45, 60, 90]:
        ax3b.axvline(x=ang, color='r', linestyle='--', alpha=0.5)
    
    fig3.tight_layout()
    fig3.savefig(f'{output_dir}/fig03_transmission.png', dpi=150, bbox_inches='tight')
    print(f"   [Figura salva: fig03_transmission.png]")
    
    plt.close('all')
    
    return {
        'cnf': cnf,
        'analysis': analysis,
        'truth_table': tt,
    }


if __name__ == '__main__':
    results = generate_full_report()
