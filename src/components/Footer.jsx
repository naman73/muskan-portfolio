import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personalInfo } from "../data/content";
import { FaLinkedinIn } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const taglines = [
  "Made with strategy, caffeine, and a little bit of chaos.",
  "No brands were harmed in the making of this portfolio.",
  "Currently accepting briefs and compliments.",
  "Built different. Briefed better.",
];

export default function Footer() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="border-t border-warm-200 bg-warm-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex h-6 items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-medium text-warm-400"
            >
              {taglines[idx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <a
              href="#"
              className="font-serif text-lg font-semibold text-warm-900"
            >
              {personalInfo.name.split(" ")[0]}
              <span className="text-primary-600">.</span>
            </a>
            <p className="mt-1 text-sm text-warm-500">
              &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 text-warm-500 transition-all hover:border-primary-300 hover:text-primary-600 hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 text-warm-500 transition-all hover:border-primary-300 hover:text-primary-600 hover:scale-110"
              aria-label="Email"
            >
              <HiMail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
