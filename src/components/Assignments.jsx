import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { assignments } from "../data/content";

const typeIcons = {
  "Strategic Pitch": "SP",
  "Content & Editorial": "CE",
};

const typeColors = {
  "Strategic Pitch": "from-primary-500 to-primary-700",
  "Content & Editorial": "from-amber-500 to-amber-700",
};

export default function Assignments() {
  return (
    <section id="assignments" className="bg-warm-100 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
                Personal / Exploratory Work
              </p>
              <h2 className="font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
                Beyond the brief.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-warm-500">
              Strategic pitch decks, assignments, and independent work that
              showcase thinking beyond day-to-day execution.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {assignments.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-5 rounded-2xl border border-warm-200 bg-white px-6 py-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white ${
                    typeColors[item.type] || "from-warm-400 to-warm-600"
                  }`}
                >
                  {typeIcons[item.type] || "W"}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-base font-bold text-warm-900 transition-colors group-hover:text-primary-600">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-warm-400">
                    {item.type}
                  </p>
                </div>
                <div className="ml-auto shrink-0 text-warm-300 transition-colors group-hover:text-primary-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
