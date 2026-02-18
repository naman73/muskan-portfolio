import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { projects } from "../data/content";
import { HiArrowRight, HiX, HiExternalLink, HiPlay } from "react-icons/hi";

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="portfolio" className="bg-warm-100 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Projects
          </p>
          <h2 className="mb-4 font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
            Campaigns & work I've shaped.
          </h2>
          <p className="mb-12 max-w-2xl text-warm-500">
            A selection of campaigns and brand projects I've led or contributed
            to across TV, digital, and social.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <div className="group flex h-full flex-col rounded-2xl border border-warm-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                {project.image && (
                  <div className="overflow-hidden rounded-t-2xl">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span
                    className={`mb-3 inline-block self-start rounded-full px-3 py-1 text-xs font-semibold ${
                      project.featured
                        ? "bg-primary-50 text-primary-700"
                        : "bg-warm-100 text-warm-500"
                    }`}
                  >
                    {project.category}
                  </span>
                  <h3 className="mb-2 font-serif text-lg font-bold text-warm-900 transition-colors group-hover:text-primary-600">
                    {project.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-warm-500">
                    {project.description.split("\n\n")[0]}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setSelected(project)}
                      className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-primary-600 transition-transform hover:translate-x-0.5"
                    >
                      View Details <HiArrowRight className="h-4 w-4" />
                    </button>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-full bg-warm-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
                      >
                        <HiPlay className="h-3.5 w-3.5" /> Watch
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

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
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full rounded-t-3xl object-cover"
                  loading="lazy"
                />
              )}

              <div className="p-8">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-warm-400 backdrop-blur-sm transition-colors hover:bg-warm-100 hover:text-warm-700"
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
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-warm-200 bg-warm-50 px-3 py-1 text-xs font-medium text-warm-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700"
                  >
                    <HiPlay className="h-4 w-4" /> Watch
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
