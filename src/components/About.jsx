import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { summary, personalInfo } from "../data/content";
import { HiBriefcase, HiLocationMarker, HiMail } from "react-icons/hi";

const stats = [
  { value: 2, suffix: "+", label: "Years in Advertising" },
  { value: 10, suffix: "+", label: "Brands Worked On" },
  { value: 4, suffix: "+", label: "National Campaigns" },
];

function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = duration / value;
    const timer = setInterval(() => {
      start++;
      setCount(start);
      if (start >= value) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            About Me
          </p>
          <h2 className="mb-12 font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
            Strategy-first thinking,<br />
            brand-led execution.
          </h2>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-5">
          <ScrollReveal className="lg:col-span-3" delay={0.1}>
            <div className="space-y-4">
              {summary.split("\n\n").map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-warm-600">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-warm-500">
              <span className="flex items-center gap-2">
                <HiBriefcase className="h-4 w-4 text-primary-500" />
                Brand & Marketing
              </span>
              <span className="flex items-center gap-2">
                <HiLocationMarker className="h-4 w-4 text-primary-500" />
                {personalInfo.location}
              </span>
              <span className="flex items-center gap-2">
                <HiMail className="h-4 w-4 text-primary-500" />
                {personalInfo.email}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-2" delay={0.2}>
            <div className="grid grid-cols-3 gap-6 rounded-2xl bg-warm-100 p-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-serif text-3xl font-bold text-primary-600">
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs font-medium text-warm-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
