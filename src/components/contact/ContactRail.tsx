"use client";

import { contactLinks } from "@/lib/data/contact";

/**
 * Side rail of contact methods. Styled to read like the address column
 * of an envelope — not a row of social icons. Each link reachable via
 * its native scheme.
 */
export default function ContactRail() {
  return (
    <ul className="space-y-6" aria-label="Other ways to reach me">
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
    </ul>
  );
}