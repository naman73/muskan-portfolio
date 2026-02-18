import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { projects } from "../data/content";
import { HiArrowRight, HiX } from "react-icons/hi";

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="portfolio" className="bg-warm-100 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Portfolio
          </p>
          <h2 className="mb-4 font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
            Featured case studies.
          </h2>
          <p className="mb-12 max-w-2xl text-warm-500">
            Deep dives into the brands I've shaped — the thinking behind the
            strategy, the execution, and the business impact.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <motion.button
                onClick={() => setSelected(project)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group w-full cursor-pointer rounded-2xl border border-warm-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <span
                  className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    project.featured
                      ? "bg-primary-50 text-primary-700"
                      : "bg-warm-100 text-warm-500"
                  }`}
                >
                  {project.category}
                </span>
                <h3 className="mb-2 font-serif text-lg font-bold text-warm-900 group-hover:text-primary-600 transition-colors">
                  {project.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-warm-500">
                  {project.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-transform group-hover:translate-x-1">
                  View Details <HiArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-warm-900/60 p-6 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-700"
                aria-label="Close"
              >
                <HiX className="h-5 w-5" />
              </button>

              <span className="mb-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                {selected.category}
              </span>
              <h3 className="mb-1 font-serif text-2xl font-bold text-warm-900">
                {selected.title}
              </h3>
              <p className="mb-4 text-sm font-medium text-primary-600">
                {selected.client}
              </p>
              <div className="mb-6 space-y-3">
                {selected.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-warm-600">
                    {para.includes(":") && i < selected.description.split("\n\n").length - 1 ? (
                      <>
                        <span className="font-semibold text-warm-800">
                          {para.split(":")[0]}:
                        </span>
                        {para.substring(para.indexOf(":") + 1)}
                      </>
                    ) : (
                      para
                    )}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-warm-200 bg-warm-50 px-3 py-1 text-xs font-medium text-warm-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
