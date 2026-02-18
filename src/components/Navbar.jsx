import { useState, useEffect } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { navLinks, personalInfo } from "../data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onHashChange = () => setMobileOpen(false);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const toggleMenu = () => setMobileOpen((prev) => !prev);
  const closeMenu = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        mobileOpen
          ? "bg-warm-50"
          : scrolled
            ? "bg-warm-50/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
      }`}
    >
      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-serif text-xl font-semibold tracking-tight text-warm-900"
        >
          {personalInfo.name.split(" ")[0]}
          <span className="text-primary-600">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-warm-600 transition-colors hover:text-primary-600"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={toggleMenu}
          className="relative z-20 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <HiX className="h-6 w-6 text-warm-900" />
          ) : (
            <HiMenuAlt3 className="h-6 w-6 text-warm-900" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-warm-50 md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-serif text-2xl font-medium text-warm-900 transition-colors hover:text-primary-600"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
