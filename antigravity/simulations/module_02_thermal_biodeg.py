"""
CHIP FOLD — MÓDULO 02: ANÁLISE TÉRMICA E BIODEGRADABILIDADE
============================================================
Simulação do comportamento térmico do Chip Fold sob carga
computacional e análise da taxa de biodegradação pós-vida útil.

Modelos:
  - Condução térmica: Equação de Fourier 1D/2D
  - Degradação térmica: Arrhenius (cinética de decomposição)
  - Biodegradação: Modelo de primeira ordem (compostagem industrial)

Referências:
  - Yang et al., Prog. Polym. Sci. 2011 (degradação celulose)
  - Dufresne, Mater. Today 2013 (nanocelulose térmicas)

Autor: Framework para projeto Chip Fold
Data: Março 2026
"""

import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')


# ============================================================
# MODELO TÉRMICO — CHIP FOLD EM OPERAÇÃO
# ============================================================

class ThermalModel:
    """
    Modelo térmico do Chip Fold em operação.
    
    O chip é modelado como uma placa fina (1 cm²) com geração
    interna de calor e dissipação por condução + convecção natural.
    """
    
    def __init__(self):
        # Geometria do chip
        self.area_cm2 = 1.0
        self.area_m2 = self.area_cm2 * 1e-4
        self.thickness_um = 500  # µm (chip CNF encapsulado)
        self.thickness_m = self.thickness_um * 1e-6
        
        # Propriedades CNF + encapsulamento organosilica
        self.density = 1400  # kg/m³ (CNF + organosilica compósito)
        self.cp = 1100  # J/(kg·K) (calor específico compósito)
        self.k_cnf = 1.0  # W/(m·K) axial
        self.k_encap = 0.25  # W/(m·K) organosilica
        self.k_eff = 0.5  # W/(m·K) efetivo (compósito, conservador)
        
        # Limites operacionais
        self.T_ambient = 25.0  # °C
        self.T_max_operation = 180.0  # °C (encapsulamento limita)
        self.T_decomposition = 260.0  # °C (CNF degrada)
        
        # Convecção (com dissipador / heatsink — cenário realista)
        # Heatsink padrão de alumínio 40x40mm com fins: efetiva ~20 cm²
        self.heatsink_area_factor = 20.0  # Área efetiva do heatsink / área do die
        self.h_conv_natural = 10.0 * self.heatsink_area_factor   # W/(m²·K) efetivo
        self.h_conv_forced = 50.0 * self.heatsink_area_factor    # W/(m²·K) efetivo
        self.h_conv_liquid = 500.0 * self.heatsink_area_factor   # W/(m²·K) efetivo (coldplate)
        
    def steady_state_temperature(self, power_density_W_cm2, cooling='natural'):
        """
        Calcula temperatura em regime estacionário.
        
        T_chip = T_amb + Q / (h * A)
        
        Args:
            power_density_W_cm2: dissipação de potência (W/cm²)
            cooling: 'natural', 'forced', 'liquid'
        """
        h_map = {
            'natural': self.h_conv_natural,
            'forced': self.h_conv_forced,
            'liquid': self.h_conv_liquid,
        }
        h = h_map.get(cooling, self.h_conv_natural)
        
        Q = power_density_W_cm2 * self.area_cm2  # W
        
        # Resistência térmica total: condução pelo chip + convecção
        R_cond = self.thickness_m / (self.k_eff * self.area_m2)  # K/W
        R_conv = 1.0 / (h * self.area_m2)  # K/W
        R_total = R_cond + R_conv
        
        T_chip = self.T_ambient + Q * R_total
        
        # Verificações
        operable = T_chip < self.T_max_operation
        safe = T_chip < self.T_decomposition
        
        return {
            'potência (W/cm²)': power_density_W_cm2,
            'refrigeração': cooling,
            'T_chip (°C)': T_chip,
            'T_max_operação (°C)': self.T_max_operation,
            'T_decomposição (°C)': self.T_decomposition,
            'operável': operable,
            'seguro': safe,
            'R_total (K/W)': R_total,
            'margem térmica (°C)': self.T_max_operation - T_chip if operable else -(T_chip - self.T_max_operation),
        }
    
    def transient_response(self, power_density_W_cm2, cooling='natural', 
                           duration_s=60.0, dt=0.01):
        """
        Simulação transiente: T(t) ao ligar o chip.
        
        C * dT/dt = Q - h*A*(T - T_amb)
        """
        h_map = {
            'natural': self.h_conv_natural,
            'forced': self.h_conv_forced,
            'liquid': self.h_conv_liquid,
        }
        h = h_map.get(cooling, self.h_conv_natural)
        
        Q = power_density_W_cm2 * self.area_cm2  # W
        mass = self.density * self.area_m2 * self.thickness_m  # kg
        C = mass * self.cp  # J/K (capacidade térmica total)
        
        def dTdt(t, T):
            return (Q - h * self.area_m2 * (T[0] - self.T_ambient)) / C
        
        sol = solve_ivp(dTdt, [0, duration_s], [self.T_ambient],
                       max_step=dt, dense_output=True)
        
        t_eval = np.linspace(0, duration_s, 1000)
        T_eval = sol.sol(t_eval)[0]
        
        # Constante de tempo
        tau = C / (h * self.area_m2)
        
        return {
            't': t_eval,
            'T': T_eval,
            'tau (s)': tau,
            'T_final (°C)': T_eval[-1],
            'T_95percent_time (s)': 3 * tau,  # 95% do estado estacionário
        }
    
    def thermal_comparison_silicon(self):
        """
        Comparação térmica: Chip Fold vs Silício equivalente.
        """
        # Chip Fold (do White Paper: 4-6 W/cm² full load)
        cf_idle = self.steady_state_temperature(1.0, 'natural')
        cf_load = self.steady_state_temperature(5.0, 'forced')
        cf_max = self.steady_state_temperature(6.0, 'liquid')
        
        # Silício equivalente (15-20 W/cm² full load, Apple M4 class)
        # Silício: k = 150 W/(m·K), cp = 700 J/(kg·K)
        si = ThermalModel()
        si.k_eff = 150.0  # Silício conduz MUITO melhor
        si.density = 2330  # kg/m³
        si.cp = 700
        si.T_max_operation = 105  # °C (CMOS padrão, junction temp)
        si.T_decomposition = 1414  # °C (ponto de fusão Si)
        si.heatsink_area_factor = 20.0
        si.h_conv_natural = 10.0 * 20.0
        si.h_conv_forced = 50.0 * 20.0
        si.h_conv_liquid = 500.0 * 20.0
        
        si_idle = si.steady_state_temperature(2.0, 'natural')
        si_load = si.steady_state_temperature(17.0, 'forced')
        si_max = si.steady_state_temperature(20.0, 'liquid')
        
        return {
            'chip_fold': {
                'idle': cf_idle,
                'full_load': cf_load,
                'max_stress': cf_max,
            },
            'silicon': {
                'idle': si_idle,
                'full_load': si_load,
                'max_stress': si_max,
            }
        }


# ============================================================
# MODELO DE BIODEGRADAÇÃO
# ============================================================

class BiodegradationModel:
    """
    Modelo de biodegradação do Chip Fold em compostagem industrial.
    
    Cinética de primeira ordem: dM/dt = -k * M
    onde k depende de temperatura, umidade e atividade microbiana.
    
    Referência: ASTM D6400-19 (compostabilidade)
    Critério: ≥90% de degradação em ≤180 dias
    """
    
    def __init__(self):
        # Composição do chip (por massa)
        self.mass_total_g = 0.5  # Chip de 1 cm², ~0.5 g
        self.fractions = {
            'CNF': 0.60,           # 60% celulose nanofibrilada
            'organosilica': 0.25,  # 25% encapsulamento
            'carbono': 0.10,       # 10% substrato de carbono
            'água residual': 0.05, # 5% água/aditivos
        }
        
        # Constantes de degradação (1/dia) em condições ótimas
        # Compostagem industrial: 55-65°C, 50-60% umidade
        self.k_rates = {
            'CNF': 0.025,          # ~28 dias para 50% (celulose degrada bem)
            'organosilica': 0.005, # ~140 dias para 50% (mais lento)
            'carbono': 0.002,      # ~350 dias para 50% (muito lento)
            'água residual': 0.50, # Evapora/absorve rapidamente
        }
        
        # Fatores de correção
        self.temp_optimal_C = 58.0  # Temperatura ótima de compostagem
        
    def arrhenius_correction(self, T_C, Ea_kJ_mol=50.0):
        """Fator de correção de Arrhenius para temperatura."""
        R = 8.314e-3  # kJ/(mol·K)
        T_K = T_C + 273.15
        T_ref_K = self.temp_optimal_C + 273.15
        return np.exp(-Ea_kJ_mol / R * (1/T_K - 1/T_ref_K))
    
    def simulate_degradation(self, T_C=58.0, duration_days=365, moisture_factor=1.0):
        """
        Simula a curva de degradação de cada componente.
        
        Returns:
            dict com t, massa por componente, massa total, e tempo para 90%
        """
        t = np.linspace(0, duration_days, 1000)
        f_temp = self.arrhenius_correction(T_C)
        
        masses = {}
        total_mass = np.zeros_like(t)
        
        for component, fraction in self.fractions.items():
            m0 = self.mass_total_g * fraction
            k = self.k_rates[component] * f_temp * moisture_factor
            m_t = m0 * np.exp(-k * t)
            masses[component] = m_t
            total_mass += m_t
        
        # Fração de massa remanescente
        fraction_remaining = total_mass / self.mass_total_g
        
        # Tempo para 90% de degradação
        idx_90 = np.argmax(fraction_remaining < 0.10)
        t_90 = t[idx_90] if idx_90 > 0 else float('inf')
        
        # Conformidade ASTM D6400 (≥90% em ≤180 dias)
        compliant = t_90 <= 180
        
        return {
            't': t,
            'masses': masses,
            'total': total_mass,
            'fraction_remaining': fraction_remaining,
            't_90_percent (dias)': t_90,
            'ASTM_D6400_conforme': compliant,
            'T_compostagem (°C)': T_C,
        }
    
    def sensitivity_analysis(self):
        """
        Análise de sensibilidade: degradação a diferentes temperaturas.
        """
        temps = [25, 35, 45, 55, 58, 65]  # °C
        results = {}
        for T in temps:
            results[T] = self.simulate_degradation(T)
        return results


# ============================================================
# GERAÇÃO DE RELATÓRIO TÉRMICO + BIODEGRADAÇÃO
# ============================================================

def generate_thermal_report(output_dir='/home/claude/chipfold_sim/output'):
    """Gera relatório térmico e de biodegradação com figuras."""
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    thermal = ThermalModel()
    bio = BiodegradationModel()
    
    print("\n" + "=" * 70)
    print("CHIP FOLD — ANÁLISE TÉRMICA E BIODEGRADABILIDADE")
    print("=" * 70)
    
    # 1. Análise térmica em regime estacionário
    print("\n1. TEMPERATURA EM REGIME ESTACIONÁRIO")
    print("-" * 40)
    
    scenarios = [
        ('Idle (1 W/cm²)', 1.0, 'natural'),
        ('Idle (1 W/cm²)', 1.0, 'forced'),
        ('Carga média (3 W/cm²)', 3.0, 'forced'),
        ('Carga total (5 W/cm²)', 5.0, 'forced'),
        ('Carga total (5 W/cm²)', 5.0, 'liquid'),
        ('Stress test (6 W/cm²)', 6.0, 'liquid'),
    ]
    
    for label, pwr, cool in scenarios:
        r = thermal.steady_state_temperature(pwr, cool)
        status = "OK" if r['operável'] else "EXCEDE LIMITE"
        print(f"   {label} [{cool}]: {r['T_chip (°C)']:.1f}°C "
              f"(margem: {r['margem térmica (°C)']:.1f}°C) [{status}]")
    
    # 2. Comparação com silício
    print("\n2. COMPARAÇÃO TÉRMICA: CHIP FOLD vs SILÍCIO")
    print("-" * 40)
    comp = thermal.thermal_comparison_silicon()
    for chip_type, scenarios_data in comp.items():
        print(f"\n   {chip_type.upper()}:")
        for scenario, data in scenarios_data.items():
            print(f"     {scenario}: {data['T_chip (°C)']:.1f}°C "
                  f"(max: {data['T_max_operação (°C)']}°C) "
                  f"{'OK' if data['operável'] else 'EXCEDE'}")
    
    # 3. Biodegradação
    print("\n3. BIODEGRADAÇÃO — COMPOSTAGEM INDUSTRIAL")
    print("-" * 40)
    bio_result = bio.simulate_degradation(58.0)
    print(f"   Temperatura: {bio_result['T_compostagem (°C)']}°C")
    print(f"   Tempo para 90% de degradação: {bio_result['t_90_percent (dias)']:.0f} dias")
    print(f"   Conformidade ASTM D6400: {'SIM' if bio_result['ASTM_D6400_conforme'] else 'NÃO'}")
    
    # Figuras
    # Fig 4: Resposta transiente
    fig4, axes4 = plt.subplots(1, 3, figsize=(16, 5))
    fig4.suptitle('Chip Fold — Resposta Térmica Transiente', fontsize=14, fontweight='bold')
    
    for idx, (cool, title) in enumerate([('natural', 'Convecção Natural'),
                                          ('forced', 'Convecção Forçada'),
                                          ('liquid', 'Refrigeração Líquida')]):
        ax = axes4[idx]
        for pwr in [1.0, 3.0, 5.0, 6.0]:
            tr = thermal.transient_response(pwr, cool, duration_s=120)
            ax.plot(tr['t'], tr['T'], label=f'{pwr} W/cm²')
        
        ax.axhline(y=thermal.T_max_operation, color='r', linestyle='--', alpha=0.7, label='Limite 180°C')
        ax.set_xlabel('Tempo (s)')
        ax.set_ylabel('Temperatura (°C)')
        ax.set_title(title)
        ax.legend(fontsize=8)
        ax.grid(True, alpha=0.3)
    
    fig4.tight_layout()
    fig4.savefig(f'{output_dir}/fig04_thermal_transient.png', dpi=150, bbox_inches='tight')
    print(f"\n   [Figura salva: fig04_thermal_transient.png]")
    
    # Fig 5: Curvas de biodegradação
    fig5, (ax5a, ax5b) = plt.subplots(1, 2, figsize=(14, 6))
    fig5.suptitle('Chip Fold — Biodegradação em Compostagem', fontsize=14, fontweight='bold')
    
    # 5a: Componentes individuais a 58°C
    bio_opt = bio.simulate_degradation(58.0, 365)
    for comp_name, mass in bio_opt['masses'].items():
        ax5a.plot(bio_opt['t'], mass * 1000, label=comp_name)  # mg
    ax5a.plot(bio_opt['t'], bio_opt['total'] * 1000, 'k-', linewidth=2, label='TOTAL')
    ax5a.axhline(y=bio.mass_total_g * 0.10 * 1000, color='r', linestyle='--', label='10% residual')
    ax5a.axvline(x=180, color='gray', linestyle=':', label='180 dias (ASTM)')
    ax5a.set_xlabel('Tempo (dias)')
    ax5a.set_ylabel('Massa (mg)')
    ax5a.set_title('Degradação por Componente (58°C)')
    ax5a.legend(fontsize=8)
    ax5a.grid(True, alpha=0.3)
    
    # 5b: Sensibilidade à temperatura
    sens = bio.sensitivity_analysis()
    for T, data in sens.items():
        ax5b.plot(data['t'], data['fraction_remaining'] * 100, label=f'{T}°C')
    ax5b.axhline(y=10, color='r', linestyle='--', label='10% (meta ASTM)')
    ax5b.axvline(x=180, color='gray', linestyle=':', label='180 dias')
    ax5b.set_xlabel('Tempo (dias)')
    ax5b.set_ylabel('Massa Remanescente (%)')
    ax5b.set_title('Sensibilidade à Temperatura')
    ax5b.legend(fontsize=8)
    ax5b.grid(True, alpha=0.3)
    ax5b.set_ylim(0, 105)
    
    fig5.tight_layout()
    fig5.savefig(f'{output_dir}/fig05_biodegradation.png', dpi=150, bbox_inches='tight')
    print(f"   [Figura salva: fig05_biodegradation.png]")
    
    plt.close('all')
    
    return {
        'thermal': thermal,
        'biodegradation': bio_result,
    }


if __name__ == '__main__':
    generate_thermal_report()
