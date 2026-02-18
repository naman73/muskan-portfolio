import ScrollReveal from "./ScrollReveal";
import { education } from "../data/content";
import { HiAcademicCap } from "react-icons/hi";

export default function Education() {
  return (
    <section id="education" className="bg-warm-100 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Education
          </p>
          <h2 className="mb-12 font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
            Academic background.
          </h2>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {education.map((edu, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                  <HiAcademicCap className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="mb-1 font-serif text-lg font-bold text-warm-900">
                  {edu.institution}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-warm-600">
                  {edu.degree}
                </p>
                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-warm-100">
                  <span className="text-xs font-medium text-warm-500">
                    {edu.period}
                  </span>
                  {edu.grade && (
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                      {edu.grade}
                    </span>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
