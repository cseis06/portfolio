"use client";

import { contactLinks } from "@/lib/data/contact";
import RollingLabel from "../ui/RollingLabel";

/**
 * Side rail of contact methods. Styled to read like the address column
 * of an envelope — not a row of social icons. Each link reachable via
 * its native scheme.
 */
export default function ContactRail() {
  return (
    <ul className="space-y-5" aria-label="Other ways to reach me">
      {contactLinks.map((link) => (
        <li key={link.id} className="group">
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="
              block
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-blood focus-visible:ring-offset-2
              focus-visible:ring-offset-bone
            "
          >
            <p
              className="
                font-sans text-[10px] uppercase tracking-[0.4em]
                text-ink/45 group-hover:text-blood
                transition-colors
                mb-1
              "
            >
              ▸ {link.label}
            </p>
            <p
              className="
                font-script text-2xl md:text-3xl
                text-ink group-hover:text-blood
                transition-colors
                leading-tight
              "
            >
              {link.display}
            </p>
          </a>
        </li>
      ))}
      <li>
        <p
          className="
            font-sans text-[10px] uppercase tracking-[0.4em]
            text-ink/45 group-hover:text-blood
            transition-colors
            mb-1
          "
        >
          ▸ You can also
        </p>
        <a
          data-exp-cv
          href="/cv/daniela-brunetto-cv.pdf"
          download
          className="
            group inline-flex items-center gap-4
            px-5 py-4
            bg-bone text-ink
            border-2 border-bone
            hover:bg-blood hover:text-bone hover:border-blood
            transition-colors duration-200
            shadow-[4px_4px_0_0_rgba(153,27,27,0.6)]
            hover:shadow-[6px_6px_0_0_rgba(250,250,249,0.2)]
          "
          aria-label="Download CV (PDF)"
        >
          <span className="flex flex-col items-start">
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] opacity-70">
              File · PDF
            </span>
            <RollingLabel className="font-display text-2xl uppercase mt-1">
              Download CV
            </RollingLabel>
          </span>
        </a>
      </li>
    </ul>
  );
}