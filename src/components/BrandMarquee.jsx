import { motion } from "framer-motion";

const brands = [
  "Hindware",
  "Queo",
  "KEI Wires & Cables",
  "Tuborg",
  "Hamdard",
  "Valvoline",
  "Havells",
  "Hero Vida",
];

export default function BrandMarquee() {
  const doubled = [...brands, ...brands];

  return (
    <section className="overflow-hidden border-y border-warm-200 bg-warm-100/50 py-5">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex w-max items-center gap-10"
      >
        {doubled.map((brand, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-warm-400"
          >
            {brand}
            <span className="ml-10 text-primary-300">/</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
