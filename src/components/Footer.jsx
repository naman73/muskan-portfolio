import { personalInfo } from "../data/content";
import { FaLinkedinIn } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="border-t border-warm-200 bg-warm-50 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 text-warm-500 transition-colors hover:border-primary-300 hover:text-primary-600"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 text-warm-500 transition-colors hover:border-primary-300 hover:text-primary-600"
            aria-label="Email"
          >
            <HiMail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
