import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { skills } from "../data/content";

const categoryLabels = {
  brand: "Brand & Campaign",
  digital: "Digital & Content",
  execution: "Campaign & Execution",
  tools: "Tools & Platforms",
};

const categoryColors = {
  brand: "bg-primary-50 text-primary-700 border-primary-200",
  digital: "bg-amber-50 text-amber-700 border-amber-200",
  execution: "bg-sky-50 text-sky-700 border-sky-200",
  tools: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Skills() {
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="bg-warm-100 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Skills & Expertise
          </p>
          <h2 className="mb-12 font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
            What I bring to the table.
          </h2>
        </ScrollReveal>

        <div className="grid gap-8 sm:grid-cols-2">
          {Object.entries(grouped).map(([category, items], catIdx) => (
            <ScrollReveal key={category} delay={catIdx * 0.1}>
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-warm-500">
                  {categoryLabels[category]}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, i) => (
                    <motion.span
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 + catIdx * 0.1 }}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium ${categoryColors[category]}`}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
