import ScrollReveal from "./ScrollReveal";
import { experience } from "../data/content";

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Experience
          </p>
          <h2 className="mb-12 font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
            Where I've worked.
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {experience.map((exp, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-warm-900">
                    {exp.role}
                  </h3>
                  {exp.current && (
                    <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-primary-600">
                  {exp.company}
                </p>
                <p className="mt-auto pt-4 text-xs font-medium text-warm-400">
                  {exp.period}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
