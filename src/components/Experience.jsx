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
            My professional journey.
          </h2>
        </ScrollReveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 hidden h-full w-px bg-warm-200 md:block" />

          <div className="space-y-10">
            {experience.map((exp, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="relative grid gap-4 md:grid-cols-[40px_1fr] md:gap-8">
                  {/* Timeline dot */}
                  <div className="hidden md:flex md:justify-center">
                    <div
                      className={`mt-1.5 h-3 w-3 rounded-full ring-4 ring-warm-50 ${
                        exp.current ? "bg-primary-500" : "bg-warm-300"
                      }`}
                    />
                  </div>

                  <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-warm-900">
                          {exp.role}
                        </h3>
                        <p className="text-sm font-medium text-primary-600">
                          {exp.company}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          exp.current
                            ? "bg-primary-50 text-primary-700"
                            : "bg-warm-100 text-warm-500"
                        }`}
                      >
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {exp.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm leading-relaxed text-warm-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
