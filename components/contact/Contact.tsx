"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { personal } from "@/data/portfolio";
import { JrMark, Wordmark } from "@/components/brand/Logo";

/** `mail` is the pre-config path: the draft was handed to the visitor's own client. */
type FormStatus = "idle" | "sending" | "sent" | "mail" | "error";
type FieldName = "name" | "email" | "subject" | "message";
type FormValues = Record<FieldName, string>;

const EMPTY: FormValues = { name: "", email: "", subject: "", message: "" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side checks so a misaddressed enquiry fails here instead of in an outbox. */
function validate(values: FormValues) {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.name.trim()) errors.name = "Please tell me your name.";
  if (!values.email.trim()) errors.email = "An email address is required — that's how I reply.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "That address doesn't look complete.";
  if (!values.message.trim()) errors.message = "A short note about the project helps.";
  else if (values.message.trim().length < 12) errors.message = "A little more detail, please.";
  return errors;
}

const fieldClass =
  "w-full bg-transparent border-b py-2 text-base font-medium text-black transition-colors duration-300 placeholder:text-hint-on-light focus:outline-none";

export default function Contact() {
  const reducedMotion = usePrefersReducedMotion();
  const [formData, setFormData] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const entrance = {
    hidden: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reducedMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: "easeOut" as const, staggerChildren: reducedMotion ? 0 : 0.1 },
    },
  };

  const item = {
    hidden: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reducedMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Editing again means the visitor is still working on the note, so drop the
    // previous outcome banner rather than leaving "Sent" over fresh typing.
    if (status === "sent" || status === "error" || status === "mail") setStatus("idle");
    // Clear the error as soon as the field is being fixed.
    setErrors((prev) => (prev[name as FieldName] ? { ...prev, [name]: undefined } : prev));
  };

  /** The draft, packaged for a mail client — used only when the endpoint can't send. */
  const mailtoHref = () => {
    const subject = encodeURIComponent(formData.subject.trim() || "Portfolio contact");
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
    );
    return `mailto:${personal.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(formData);
    setErrors(nextErrors);

    const firstKey = Object.keys(nextErrors)[0] as FieldName | undefined;
    if (firstKey) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
        ?.focus();
      return;
    }

    setStatus("sending");
    setServerError(null);

    const honeypot =
      (formRef.current?.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, company: honeypot }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;

      if (res.ok) {
        // Cleared only on a real send: a draft that failed stays on screen.
        setFormData(EMPTY);
        setStatus("sent");
        return;
      }

      // The endpoint has no SMTP credentials yet. Hand the note to the visitor's
      // own client instead of dead-ending them — and keep the fields filled, so
      // nothing is lost if their machine has no mail handler either.
      if (res.status === 503) {
        window.location.href = mailtoHref();
        setStatus("mail");
        return;
      }

      setServerError(data?.error ?? "The message could not be sent.");
      setStatus("error");
    } catch {
      setServerError("Couldn't reach the server — check your connection and try again.");
      setStatus("error");
    }
  };

  const errorFor = (name: FieldName) => {
    const message = errors[name];
    return message ? (
      <p id={`contact-${name}-error`} className="m-0 text-xs font-medium text-red-600" role="alert">
        {message}
      </p>
    ) : null;
  };

  return (
    <section
      id="contact"
      className="min-h-[100dvh] bg-white text-black font-sans py-24 md:py-32 flex flex-col justify-center"
      aria-labelledby="contact-heading"
    >
      <div className="shell grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-12">
        {/* Left: heading */}
        <motion.div
          className="md:col-span-4 lg:col-span-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={entrance}
        >
          <motion.h2
            variants={item}
            id="contact-heading"
            className="eyebrow mb-6 text-faint-on-light"
          >
            Let&apos;s Work Together
          </motion.h2>
          <motion.p
            variants={item}
            className="font-display font-bold leading-tight tracking-tight"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
            }}
          >
            Have something to build?
          </motion.p>
          <motion.p
            variants={item}
            className="mt-6 font-sans text-sm leading-relaxed text-muted-on-light max-w-sm"
          >
            I&apos;m open to frontend engineering roles, freelance projects, and
            React Native work. Let&apos;s talk about what you&apos;re building.
          </motion.p>

          {/* Direct links */}
          <motion.div variants={item} className="mt-12 flex flex-col gap-4">
            <a
              href={`mailto:${personal.email}`}
              className="tap group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-on-light hover:text-black transition-colors duration-300"
            >
              <span
                className="w-6 h-[1px] bg-black/25 transition-[width] duration-300 group-hover:w-10 group-hover:bg-black"
                aria-hidden="true"
              />
              {personal.email}
            </a>
            <a
              href={personal.phoneHref}
              className="tap group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-on-light hover:text-black transition-colors duration-300"
            >
              <span
                className="w-6 h-[1px] bg-black/25 transition-[width] duration-300 group-hover:w-10 group-hover:bg-black"
                aria-hidden="true"
              />
              {personal.phone}
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="tap group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-on-light hover:text-black transition-colors duration-300"
            >
              <span
                className="w-6 h-[1px] bg-black/25 transition-[width] duration-300 group-hover:w-10 group-hover:bg-black"
                aria-hidden="true"
              />
              LinkedIn
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tap group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-on-light hover:text-black transition-colors duration-300"
            >
              <span
                className="w-6 h-[1px] bg-black/25 transition-[width] duration-300 group-hover:w-10 group-hover:bg-black"
                aria-hidden="true"
              />
              GitHub
            </a>
          </motion.div>

          {/* Signature lockup — decorative: the name is already in the heading
              and every channel link, so it stays out of the a11y tree. */}
          <motion.div
            variants={item}
            className="mt-14 flex items-center gap-3"
            aria-hidden="true"
          >
            <JrMark height={34} title="" className="text-[var(--logo-ember)]" />
            <Wordmark theme="light" height={22} labelled={false} />
          </motion.div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          className="md:col-span-8 lg:col-span-7 lg:col-start-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={entrance}
        >
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
            {/* Name */}
            <motion.div variants={item} className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="eyebrow text-faint-on-light">
                Name *
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className={fieldClass}
                style={{
                  borderColor: errors.name ? "#dc2626" : "rgba(0,0,0,0.15)",
                }}
                placeholder="Your name"
                required
                aria-required="true"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
              {errorFor("name")}
            </motion.div>

            {/* Email + Subject */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <motion.div variants={item} className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="eyebrow text-faint-on-light">
                  Email *
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  inputMode="email"
                  className={fieldClass}
                  style={{
                    borderColor: errors.email ? "#dc2626" : "rgba(0,0,0,0.15)",
                  }}
                  placeholder="you@example.com"
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
                {errorFor("email")}
              </motion.div>
              <motion.div variants={item} className="flex flex-col gap-1.5">
                <label htmlFor="contact-subject" className="eyebrow text-faint-on-light">
                  Subject
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  autoComplete="off"
                  className={fieldClass}
                  style={{ borderColor: "rgba(0,0,0,0.15)" }}
                  placeholder="Project inquiry"
                />
              </motion.div>
            </div>

            {/* Message */}
            <motion.div variants={item} className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="eyebrow text-faint-on-light">
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={fieldClass + " resize-none"}
                style={{
                  borderColor: errors.message ? "#dc2626" : "rgba(0,0,0,0.15)",
                }}
                placeholder="Tell me about your project..."
                required
                aria-required="true"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
              />
              {errorFor("message")}
            </motion.div>

            {/* Honeypot. Bots fill whatever they can see in the DOM, people never
                see this. Parked off-screen rather than display:none (a stronger bot
                signal), and out of the tab order via tabIndex so a keyboard visitor
                cannot land in a field they can't see. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-px w-px opacity-0"
            />

            {/* Submit */}
            <motion.div variants={item} className="flex flex-col gap-3">
              <button
                type="submit"
                id="contact-submit"
                disabled={status === "sending"}
                className="tap group flex items-center gap-3 w-fit text-sm font-bold uppercase tracking-[0.18em] text-black transition-colors duration-300 hover:text-accent disabled:opacity-40"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
                <span
                  className="transition-transform duration-300 group-hover:translate-x-2"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>

              <p className="sr-only">
                Your note is sent to my inbox through the contact endpoint on this site. Nothing
                you write is stored on the server.
              </p>

              {status === "sent" && (
                <p className="m-0 text-sm font-medium text-emerald-700" role="status">
                  Sent — I read every message and reply within a day or two.
                </p>
              )}

              {status === "mail" && (
                <p className="m-0 text-sm font-medium text-amber-700" role="status">
                  Your email app is opening with the note already written. If nothing appeared,
                  mail it to{" "}
                  <a href={mailtoHref()} className="underline underline-offset-4 hover:text-accent">
                    {personal.email}
                  </a>
                  .
                </p>
              )}

              {status === "error" && (
                <p className="m-0 text-sm font-medium text-red-600" role="alert">
                  {serverError} Your draft is still here — try again, or mail{" "}
                  <a href={mailtoHref()} className="underline underline-offset-4 hover:text-accent">
                    {personal.email}
                  </a>
                  .
                </p>
              )}
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
