import { motion } from "framer-motion";

const pillars = [
  {
    num: "01", priority: "PRIORITY",
    title: "Nitrogen Recovery & Water Treatment",
    body: "Decentralised lateral suction, filtration, micro-oxygenation and beneficial bacteria convert N/P into circular fertiliser. Continuous, silent, distributed across the full canal length.",
    stat: "↓ 15–25% canal nitrogen load · Deltares 2026",
  },
  {
    num: "02", priority: "PHASE 1",
    title: "Automated Logistics 24/7",
    body: "Cargo capsules up to 500 kg driven by Linear Induction Motors. Zero drivers, zero surface congestion, zero emissions. PostNL and Amazon integration from year one.",
    stat: "–25% urban delivery vehicles · operational 2027",
  },
  {
    num: "03", priority: "PHASE 2",
    title: "Passenger Capsule Mobility",
    body: "1–4 passengers. On-demand. 140 km/h cruise. Amsterdam–Rotterdam in 27 minutes door-to-door. Acceleration ≤ 0.25g. Bicycle and luggage included.",
    stat: "AMS ↔ RTD 27 min · operational 2029+",
  },
  {
    num: "04", priority: "INTEGRATED",
    title: "Energy Recovery & H₂ Transport",
    body: "Regenerative braking, micro-turbines and thermal gradient: 65–75% energy recovered. Parallel compartments for green hydrogen transport in partnership with Gasunie.",
    stat: "65–75% energy self-sufficiency · H₂ from 2033",
  },
  {
    num: "05", priority: "BACKBONE",
    title: "National Data & Sensor Grid",
    body: "Real-time water quality, flood risk, structural integrity and climate monitoring. Fibre optic backbone. Directly integrated with Delta Programme early warning systems.",
    stat: "Sovereign data infrastructure · 6,500 km coverage",
  },
  {
    num: "06", priority: "TECHNICAL SPEC",
    title: "The Frame",
    body: "Ø 1.8–2.2m · 8–12m modular segments · Self-healing bacterial concrete (TU Delft/Green Basilisk) + GFRP · Reefy/ECOncrete bio-active surface · 150+ year service life · Fully reversible in <6 months.",
    stat: "ROV + floating crane installation · Boskalis/Van Oord",
  },
];

const SystemPillars = () => (
  <section className="border-b border-border bg-card">
    <div className="max-w-[1200px] mx-auto px-8 md:px-20 py-20 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <span className="section-label">SECTION 02 — THE SYSTEM</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 leading-[1.15]">
          Five Integrated<br />Functions. <span className="text-muted-foreground font-normal">One Frame.</span>
        </h2>
        <div className="gold-rule my-5" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {pillars.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="border border-border p-7 bg-background hover:border-primary transition-colors duration-300"
          >
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-primary">
              PILLAR {p.num} — {p.priority}
            </span>
            <h3 className="font-serif text-lg font-bold text-foreground mt-3.5 mb-3 leading-[1.2]">{p.title}</h3>
            <p className="font-sans text-[0.82rem] font-light text-foreground/65 leading-[1.7]">{p.body}</p>
            <div className="font-mono text-[0.72rem] text-teal mt-4 pt-3.5 border-t border-border">
              ▸ {p.stat}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SystemPillars;
