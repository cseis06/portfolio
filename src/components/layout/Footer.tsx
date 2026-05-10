"use client";

import RollingLabel from "../ui/RollingLabel";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        w-full
        bg-bone text-ink
        border-t border-ink/10
        px-6 md:px-12 lg:px-20
        py-6 md:py-5
      "
      aria-label="Site footer"
    >
      <div
        className="
          mx-auto
          flex flex-col md:flex-row md:items-center md:justify-between
          gap-5 md:gap-8
        "
      >
        {/* Copyright — compact, left */}
        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-ink/85 md:flex-shrink-0">
          © {year} Daniela Brunetto · All rights reserved
        </p>

        {/* CTA — right, stamp-style */}
        <a
          href="https://api.whatsapp.com/send/?phone=595976167226&text&type=phone_number&app_absent=0"
          target="_blank"
          className="
            group inline-flex items-center gap-2
            md:flex-shrink-0
            px-4 py-2
            bg-ink text-bone
            border-2 border-ink
            hover:bg-blood hover:border-blood
            transition-colors duration-200
            font-display text-sm uppercase tracking-[0.15em]
            self-center md:self-auto
          "
          aria-label="Jump to the contact section"
        >
          <RollingLabel>Write to me ↗</RollingLabel>
        </a>
      </div>
    </footer>
  );
}