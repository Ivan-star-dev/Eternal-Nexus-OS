"""
CHIP FOLD — MÓDULO 03: BENCHMARKS COMPUTACIONAIS
=================================================
Modelagem comparativa de desempenho: Chip Fold Gen 1 (projetado)
vs silício de ponta (TSMC N2, Apple M4).

Métricas:
  - Densidade de portas lógicas (portas/cm²)
  - Throughput computacional (TOPS, FLOPS)
  - Eficiência energética (TOPS/W)
  - Custo por operação (USD/TOPS)
  - Latência de propagação

Nota: Valores do Chip Fold são projeções baseadas no White Paper 4.
Silício usa dados públicos de TSMC N2 e Apple M4 (2025).

Autor: Framework para projeto Chip Fold
Data: Março 2026
"""

import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')


class ComputeBenchmark:
    """
    Modelo de benchmark comparativo entre Chip Fold e silício.
    """
    
    def __init__(self):
        # ============================================
        # CHIP FOLD GEN 1 — Projeções (WP4)
        # ============================================
        self.cf = {
            'nome': 'Chip Fold Gen 1 (2028)',
            'densidade_portas_cm2': 1e15,        # 10^15 portas/cm²
            'clock_ghz': 10.0,                   # 8-12 GHz (média)
            'area_die_cm2': 1.0,                 # 1 cm² (referência)
            'consumo_idle_W_cm2': 1.0,           # 0.8-1.2 W/cm²
            'consumo_full_W_cm2': 5.0,           # 4-6 W/cm²
            'custo_fab_B_USD': 3.0,              # USD 2-4B
            'capacidade_fab_wafer_mes': 10000,   # Fab piloto
            'dies_por_wafer': 400,               # Estimativa (wafer 300mm equiv)
            'custo_die_USD': None,               # Calculado
            'memoria_logica_TB_cm2': 100.0,      # Projeção WP4
            'latencia_porta_ps': 0.5,            # Projeção (femtossegundo range)
        }
        
        # ============================================
        # TSMC N2 (2025/2026) — Dados públicos
        # ============================================
        self.n2 = {
            'nome': 'TSMC N2 (2025)',
            'densidade_portas_cm2': 1e13,        # ~10^13 (GAA, ~200M transistors/mm²)
            'clock_ghz': 5.5,                    # 5-6 GHz estimado
            'area_die_cm2': 1.0,                 # Referência normalizada
            'consumo_idle_W_cm2': 1.8,           # Estimado
            'consumo_full_W_cm2': 15.0,          # 12-18 W/cm²
            'custo_fab_B_USD': 30.0,             # USD 25-40B
            'capacidade_fab_wafer_mes': 50000,   # TSMC capacidade madura
            'dies_por_wafer': 800,               # 300mm wafer, dies menores
            'custo_die_USD': None,
            'memoria_logica_TB_cm2': 1.2,
            'latencia_porta_ps': 3.0,            # ~3 ps por estágio (estimado)
        }
        
        # ============================================
        # APPLE M4 (2025) — Dados públicos
        # ============================================
        self.m4 = {
            'nome': 'Apple M4 (2025, TSMC N3E)',
            'densidade_portas_cm2': 8e12,        # N3E ~140M tr/mm²
            'clock_ghz': 4.4,                    # 4.4 GHz boost
            'area_die_cm2': 1.05,                # ~105 mm² die size
            'consumo_idle_W_cm2': 2.0,           # ~2.1 W/cm²
            'consumo_full_W_cm2': 19.0,          # ~15-20 W/cm² peak
            'custo_fab_B_USD': 20.0,             # TSMC N3 fab
            'capacidade_fab_wafer_mes': 40000,
            'dies_por_wafer': 700,
            'custo_die_USD': None,
            'memoria_logica_TB_cm2': 0.8,
            'latencia_porta_ps': 4.0,
        }
        
        # Calcular custos derivados
        for chip in [self.cf, self.n2, self.m4]:
            self._compute_derived(chip)
    
    def _compute_derived(self, chip):
        """Calcula métricas derivadas."""
        # Custo por die (simplificado)
        # Custo total fab amortizado em 5 anos
        annual_wafers = chip['capacidade_fab_wafer_mes'] * 12
        total_dies_5y = annual_wafers * 5 * chip['dies_por_wafer']
        chip['custo_die_USD'] = (chip['custo_fab_B_USD'] * 1e9) / total_dies_5y
        
        # TOPS (Tera Operations Per Second)
        # Cada porta lógica executa ~1 operação por ciclo de clock
        # TOPS = (portas * clock) / 10^12
        total_gates = chip['densidade_portas_cm2'] * chip['area_die_cm2']
        chip['tops'] = (total_gates * chip['clock_ghz'] * 1e9) / 1e12
        
        # TOPS/W (eficiência energética)
        power_full = chip['consumo_full_W_cm2'] * chip['area_die_cm2']
        chip['tops_per_watt'] = chip['tops'] / power_full
        
        # Custo por TOPS
        chip['custo_por_tops_USD'] = chip['custo_die_USD'] / chip['tops'] if chip['tops'] > 0 else float('inf')
        
        # Latência total para um pipeline de 100 portas
        chip['latencia_100_portas_ns'] = chip['latencia_porta_ps'] * 100 / 1000
    
    def comparison_table(self):
        """Gera tabela de comparação formatada."""
        chips = [self.cf, self.n2, self.m4]
        
        metrics = [
            ('Densidade (portas/cm²)', 'densidade_portas_cm2', '{:.1e}'),
            ('Clock (GHz)', 'clock_ghz', '{:.1f}'),
            ('TOPS', 'tops', '{:.1f}'),
            ('Consumo full load (W)', 'consumo_full_W_cm2', '{:.1f}'),
            ('TOPS/W', 'tops_per_watt', '{:.2f}'),
            ('Custo por die (USD)', 'custo_die_USD', '{:.2f}'),
            ('Custo por TOPS (USD)', 'custo_por_tops_USD', '{:.6f}'),
            ('Latência 100 portas (ns)', 'latencia_100_portas_ns', '{:.3f}'),
            ('Memória lógica (TB/cm²)', 'memoria_logica_TB_cm2', '{:.1f}'),
        ]
        
        print("\n" + "=" * 80)
        print(f"{'Métrica':<30} ", end='')
        for c in chips:
            print(f"{c['nome']:<20} ", end='')
        print()
        print("=" * 80)
        
        for label, key, fmt in metrics:
            print(f"{label:<30} ", end='')
            for c in chips:
                val = c[key]
                print(f"{fmt.format(val):<20} ", end='')
            print()
        
        print("=" * 80)
        
        return chips
    
    def advantage_ratios(self):
        """Calcula vantagens do Chip Fold sobre silício."""
        ratios = {}
        
        # vs TSMC N2
        ratios['vs_N2'] = {
            'densidade': self.cf['densidade_portas_cm2'] / self.n2['densidade_portas_cm2'],
            'tops': self.cf['tops'] / self.n2['tops'],
            'eficiência (TOPS/W)': self.cf['tops_per_watt'] / self.n2['tops_per_watt'],
            'custo_fab': self.n2['custo_fab_B_USD'] / self.cf['custo_fab_B_USD'],
            'custo_por_tops': self.n2['custo_por_tops_USD'] / self.cf['custo_por_tops_USD'],
            'consumo_energia': self.n2['consumo_full_W_cm2'] / self.cf['consumo_full_W_cm2'],
        }
        
        # vs Apple M4
        ratios['vs_M4'] = {
            'densidade': self.cf['densidade_portas_cm2'] / self.m4['densidade_portas_cm2'],
            'tops': self.cf['tops'] / self.m4['tops'],
            'eficiência (TOPS/W)': self.cf['tops_per_watt'] / self.m4['tops_per_watt'],
            'custo_por_tops': self.m4['custo_por_tops_USD'] / self.cf['custo_por_tops_USD'],
            'consumo_energia': self.m4['consumo_full_W_cm2'] / self.cf['consumo_full_W_cm2'],
        }
        
        return ratios
    
    def scaling_projection(self, years=10):
        """
        Projeta a evolução de densidade e custo para Chip Fold
        e silício nos próximos N anos.
        
        Silício: Lei de Moore (desacelerando, ~1.4x a cada 2 anos)
        Chip Fold: Curva de aprendizado agressiva (3x a cada 2 anos nos primeiros 6 anos)
        """
        t = np.arange(0, years + 1)
        
        # Silício: desaceleração
        si_density = self.n2['densidade_portas_cm2'] * 1.4 ** (t / 2)
        si_cost = self.n2['custo_fab_B_USD'] * 1.15 ** t  # Custos sobem 15%/ano
        
        # Chip Fold: rampa agressiva nos primeiros 6 anos, depois estabiliza
        cf_density = np.where(
            t <= 6,
            self.cf['densidade_portas_cm2'] * 3.0 ** (t / 2),
            self.cf['densidade_portas_cm2'] * 3.0 ** 3 * 1.2 ** ((t - 6) / 2)
        )
        cf_cost = np.where(
            t <= 4,
            self.cf['custo_fab_B_USD'] * 0.8 ** t,  # Custos caem 20%/ano
            self.cf['custo_fab_B_USD'] * 0.8 ** 4 * 0.95 ** (t - 4)
        )
        
        return {
            't': t,
            'si_density': si_density,
            'si_cost': si_cost,
            'cf_density': cf_density,
            'cf_cost': cf_cost,
        }


# ============================================================
# MODELO DE CUSTO DE DATA CENTER
# ============================================================

class DataCenterModel:
    """
    Compara custos operacionais de data center com Chip Fold vs silício.
    Caso de uso: hiperescala de 1 GW (do White Paper).
    """
    
    def __init__(self):
        self.power_GW = 1.0
        self.energy_cost_USD_kWh = 0.06  # Custo médio industrial
        self.hours_per_year = 8760
        self.pue = 1.3  # Power Usage Effectiveness
        
    def annual_cost(self, chip_power_W_cm2, chip_tops, n_chips):
        """
        Calcula custo energético anual.
        """
        total_power_W = chip_power_W_cm2 * n_chips
        total_power_MW = total_power_W / 1e6
        total_power_with_pue_MW = total_power_MW * self.pue
        
        annual_energy_MWh = total_power_with_pue_MW * self.hours_per_year
        annual_cost_USD = annual_energy_MWh * 1000 * self.energy_cost_USD_kWh
        
        total_tops = chip_tops * n_chips
        cost_per_tops_year = annual_cost_USD / total_tops if total_tops > 0 else float('inf')
        
        return {
            'n_chips': n_chips,
            'potência total (MW)': total_power_MW,
            'potência com PUE (MW)': total_power_with_pue_MW,
            'energia anual (GWh)': annual_energy_MWh / 1000,
            'custo anual (M USD)': annual_cost_USD / 1e6,
            'TOPS total': total_tops,
            'USD/TOPS/ano': cost_per_tops_year,
        }
    
    def compare_1GW_datacenter(self, bench):
        """
        Compara um datacenter de 1 GW usando Chip Fold vs silício N2.
        Quantos chips são necessários para preencher 1 GW de capacidade?
        """
        # Silício N2: 15 W por chip (1 cm²)
        n_si = int(self.power_GW * 1e9 / bench.n2['consumo_full_W_cm2'])
        si_result = self.annual_cost(bench.n2['consumo_full_W_cm2'], bench.n2['tops'], n_si)
        si_result['chip'] = bench.n2['nome']
        
        # Chip Fold: 5 W por chip (1 cm²) — cabe 3x mais chips no mesmo envelope
        n_cf = int(self.power_GW * 1e9 / bench.cf['consumo_full_W_cm2'])
        cf_result = self.annual_cost(bench.cf['consumo_full_W_cm2'], bench.cf['tops'], n_cf)
        cf_result['chip'] = bench.cf['nome']
        
        return {
            'silicon': si_result,
            'chip_fold': cf_result,
            'vantagem_tops': cf_result['TOPS total'] / si_result['TOPS total'],
            'economia_custo_pct': (1 - cf_result['custo anual (M USD)'] / si_result['custo anual (M USD)']) * 100,
        }


# ============================================================
# GERAÇÃO DE RELATÓRIO
# ============================================================

def generate_benchmark_report(output_dir='/home/claude/chipfold_sim/output'):
    """Gera relatório de benchmarks com figuras."""
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    bench = ComputeBenchmark()
    dc = DataCenterModel()
    
    print("\n" + "=" * 70)
    print("CHIP FOLD — BENCHMARKS COMPUTACIONAIS")
    print("=" * 70)
    
    # 1. Tabela comparativa
    print("\n1. COMPARAÇÃO DE DESEMPENHO")
    bench.comparison_table()
    
    # 2. Vantagens relativas
    print("\n2. VANTAGENS DO CHIP FOLD")
    print("-" * 40)
    ratios = bench.advantage_ratios()
    for ref, metrics in ratios.items():
        print(f"\n   {ref}:")
        for metric, val in metrics.items():
            print(f"     {metric}: {val:.1f}x")
    
    # 3. Data center
    print("\n3. COMPARAÇÃO DATA CENTER 1 GW")
    print("-" * 40)
    dc_comp = dc.compare_1GW_datacenter(bench)
    for key in ['silicon', 'chip_fold']:
        data = dc_comp[key]
        print(f"\n   {data['chip']}:")
        print(f"     Chips: {data['n_chips']:,.0f}")
        print(f"     TOPS total: {data['TOPS total']:,.0f}")
        print(f"     Custo anual: USD {data['custo anual (M USD)']:.1f}M")
    print(f"\n   Vantagem TOPS: {dc_comp['vantagem_tops']:.1f}x")
    print(f"   Economia de custo: {dc_comp['economia_custo_pct']:.1f}%")
    
    # Figuras
    # Fig 6: Comparação de barras
    fig6, axes6 = plt.subplots(2, 2, figsize=(14, 10))
    fig6.suptitle('Chip Fold — Benchmarks vs Silício', fontsize=14, fontweight='bold')
    
    chips = [bench.cf, bench.n2, bench.m4]
    names = [c['nome'].split('(')[0].strip() for c in chips]
    colors = ['#2ecc71', '#3498db', '#e74c3c']
    
    # 6a: TOPS
    ax = axes6[0][0]
    vals = [c['tops'] for c in chips]
    ax.barh(names, vals, color=colors)
    ax.set_xlabel('TOPS')
    ax.set_title('Throughput (TOPS)')
    ax.set_xscale('log')
    for i, v in enumerate(vals):
        ax.text(v * 1.1, i, f'{v:.0f}', va='center', fontsize=9)
    
    # 6b: TOPS/W
    ax = axes6[0][1]
    vals = [c['tops_per_watt'] for c in chips]
    ax.barh(names, vals, color=colors)
    ax.set_xlabel('TOPS/W')
    ax.set_title('Eficiência Energética (TOPS/W)')
    for i, v in enumerate(vals):
        ax.text(v * 1.02, i, f'{v:.1f}', va='center', fontsize=9)
    
    # 6c: Custo por TOPS
    ax = axes6[1][0]
    vals = [c['custo_por_tops_USD'] for c in chips]
    ax.barh(names, vals, color=colors)
    ax.set_xlabel('USD/TOPS')
    ax.set_title('Custo por TOPS (USD)')
    ax.set_xscale('log')
    for i, v in enumerate(vals):
        ax.text(v * 1.1, i, f'{v:.6f}', va='center', fontsize=9)
    
    # 6d: Consumo full load
    ax = axes6[1][1]
    vals = [c['consumo_full_W_cm2'] for c in chips]
    ax.barh(names, vals, color=colors)
    ax.set_xlabel('W/cm²')
    ax.set_title('Consumo (W/cm², full load)')
    for i, v in enumerate(vals):
        ax.text(v + 0.3, i, f'{v:.1f}', va='center', fontsize=9)
    
    fig6.tight_layout()
    fig6.savefig(f'{output_dir}/fig06_benchmarks.png', dpi=150, bbox_inches='tight')
    print(f"\n   [Figura salva: fig06_benchmarks.png]")
    
    # Fig 7: Projeção de scaling
    fig7, (ax7a, ax7b) = plt.subplots(1, 2, figsize=(14, 6))
    fig7.suptitle('Chip Fold — Projeção de Escala (10 anos)', fontsize=14, fontweight='bold')
    
    proj = bench.scaling_projection(10)
    
    ax7a.semilogy(proj['t'] + 2026, proj['si_density'], 'b-o', label='Silício (N2 base)')
    ax7a.semilogy(proj['t'] + 2026, proj['cf_density'], 'g-s', label='Chip Fold')
    ax7a.set_xlabel('Ano')
    ax7a.set_ylabel('Densidade de Portas/cm²')
    ax7a.set_title('Evolução de Densidade')
    ax7a.legend()
    ax7a.grid(True, alpha=0.3)
    
    ax7b.plot(proj['t'] + 2026, proj['si_cost'], 'b-o', label='Silício (custo fab)')
    ax7b.plot(proj['t'] + 2026, proj['cf_cost'], 'g-s', label='Chip Fold')
    ax7b.set_xlabel('Ano')
    ax7b.set_ylabel('Custo de Fab (B USD)')
    ax7b.set_title('Evolução de Custo')
    ax7b.legend()
    ax7b.grid(True, alpha=0.3)
    
    fig7.tight_layout()
    fig7.savefig(f'{output_dir}/fig07_scaling.png', dpi=150, bbox_inches='tight')
    print(f"   [Figura salva: fig07_scaling.png]")
    
    plt.close('all')
    
    return bench, dc_comp


if __name__ == '__main__':
    generate_benchmark_report()
