import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { testimonials } from "../data/content";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-primary-600">
            Testimonials
          </p>
          <h2 className="mb-16 text-center font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
            What colleagues say.
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative rounded-3xl bg-warm-100 px-8 py-12 sm:px-12">
            {/* Large quote mark */}
            <span className="absolute left-6 top-6 font-serif text-7xl leading-none text-primary-200 select-none sm:left-10 sm:top-8 sm:text-8xl">
              &ldquo;
            </span>

            <div className="relative min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="pt-8"
                >
                  <p className="mb-8 text-lg leading-relaxed text-warm-700 sm:text-xl">
                    {testimonials[current].quote}
                  </p>
                  <footer className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-700">
                        {testimonials[current].author
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-warm-900">
                        {testimonials[current].author}
                      </p>
                      <p className="text-xs text-warm-500">
                        {testimonials[current].company}
                      </p>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === current
                        ? "w-8 bg-primary-500"
                        : "w-2 bg-warm-300 hover:bg-warm-400"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="rounded-full border border-warm-300 p-2 text-warm-500 transition-colors hover:border-primary-300 hover:text-primary-600"
                  aria-label="Previous testimonial"
                >
                  <HiChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="rounded-full border border-warm-300 p-2 text-warm-500 transition-colors hover:border-primary-300 hover:text-primary-600"
                  aria-label="Next testimonial"
                >
                  <HiChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
