import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { personalInfo } from "../data/content";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { FaLinkedinIn } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${personalInfo.email}?subject=Portfolio Inquiry from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.name} (${formData.email})`;
    window.open(mailtoLink, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactDetails = [
    {
      icon: HiMail,
      label: "Email",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: HiPhone,
      label: "Phone",
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
    },
    {
      icon: FaLinkedinIn,
      label: "LinkedIn",
      value: "muskangarg373",
      href: personalInfo.linkedin,
    },
    {
      icon: HiLocationMarker,
      label: "Location",
      value: personalInfo.location,
      href: null,
    },
  ];

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Contact
          </p>
          <h2 className="mb-4 font-serif text-4xl font-bold text-warm-900 sm:text-5xl">
            Let's work together.
          </h2>
          <p className="mb-12 max-w-xl text-warm-500">
            Have a project in mind or want to discuss an opportunity? I'd love to
            hear from you.
          </p>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact form */}
          <ScrollReveal className="lg:col-span-3" delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-warm-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-warm-900 placeholder-warm-400 transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-warm-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-warm-900 placeholder-warm-400 transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-warm-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-warm-900 placeholder-warm-400 transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-700/30 disabled:opacity-50"
                disabled={submitted}
              >
                {submitted ? "Message Sent!" : "Send Message"}
              </button>
            </form>
          </ScrollReveal>

          {/* Contact info */}
          <ScrollReveal className="lg:col-span-2" delay={0.2}>
            <div className="space-y-6 rounded-2xl bg-warm-100 p-8">
              {contactDetails.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-warm-400">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-warm-800">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block rounded-xl transition-colors hover:bg-white/60 -mx-2 px-2 py-2"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="px-2 py-2">
                    {content}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
