import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";
import { personalInfo } from "../data/content";

function useTypewriter(text, speed = 35, startDelay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function Hero() {
  const { displayed, done } = useTypewriter(personalInfo.tagline);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">
            {personalInfo.title}
          </p>
          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-warm-900 sm:text-6xl lg:text-7xl">
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="mr-2 inline-block origin-[70%_70%]"
            >
              Hey
            </motion.span>
            {" I'm "}
            <span className="relative">
              {personalInfo.name.split(" ")[0]}
              <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full bg-primary-200/60" />
            </span>
          </h1>
          <p className="mx-auto h-14 max-w-lg text-lg leading-relaxed text-warm-600 lg:mx-0">
            {displayed}
            {!done && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="ml-0.5 inline-block w-[2px] h-5 align-middle bg-primary-500"
              />
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-700/30 active:scale-95"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-warm-300 px-7 py-3 text-sm font-semibold text-warm-700 transition-all hover:border-primary-300 hover:text-primary-600 active:scale-95"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="order-1 flex justify-center lg:order-2"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-200/40 to-primary-100/20 blur-2xl" />
            <motion.img
              src={personalInfo.profileImage}
              alt={personalInfo.name}
              width={420}
              height={420}
              className="relative z-10 h-72 w-72 rounded-3xl object-cover shadow-2xl ring-4 ring-white/60 sm:h-96 sm:w-96 lg:h-[420px] lg:w-[420px]"
              loading="eager"
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-label="Scroll to about section"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <HiArrowDown className="h-5 w-5 text-warm-400" />
        </motion.div>
      </motion.a>
    </section>
  );
}
