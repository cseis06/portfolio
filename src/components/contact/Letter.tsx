"use client";

import { forwardRef } from "react";
import Image from "next/image";
import type { SendStatus } from "@/hooks/useContactForm";

interface LetterProps {
  name: string;
  email: string;
  message: string;
  status: SendStatus;
  errorMsg: string | null;
  onUpdate: (key: "name" | "email" | "message", value: string) => void;
  onSubmit: () => void;
}

/**
 * The letter itself — paper background with form fields styled as
 * handwriting. Inputs have no borders, no fills, just typed lines on
 * the paper. Submit is the closing line, not a separate button.
 */
const Letter = forwardRef<HTMLDivElement, LetterProps>(function Letter(
  { name, email, message, status, errorMsg, onUpdate, onSubmit },
  ref
) {
  const isLocked = status === "sending" || status === "success";

  return (
    <div
      ref={ref}
      className="relative w-full top-0 max-w-[1024px] aspect-[5/7] mx-auto"
    >
      {/* Paper background */}
      <Image
        src="/contact/letter.jpg"
        alt=""
        fill
        priority
        className="object-contain pointer-events-none select-none"
        draggable={false}
      />

      {/* Letter content — positioned over the paper */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isLocked) onSubmit();
        }}
        className="
          absolute inset-0
          flex flex-col
          px-[12%] pt-40 pb-20
          text-ink
        "
        aria-label="Contact letter"
      >
        <div className="flex flex-row-reverse justify-between">
            {/* Date line */}
          <p className="font-script text-blood/80 text-xl md:text-2xl lg:text-3xl text-right">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/* Salutation */}
          <p className="font-script text-blood/80 text-xl md:text-2xl lg:text-3xl ">
            Dear Daniela,
          </p>
        </div>

        {/* Body — message field */}
        <textarea
          value={message}
          onChange={(e) => onUpdate("message", e.target.value)}
          placeholder="I'm writing because…"
          disabled={isLocked}
          rows={6}
          aria-label="Message"
          className="
            flex-1
            bg-transparent border-0 outline-none resize-none
            font-sans text-sm md:text-base
            text-ink/90 placeholder:text-ink/30
            leading-[1.9]
            focus:ring-0
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        />

        {/* Closing */}
        <div className="mt-4 space-y-2">
          <p className="font-sans text-sm text-ink/85">Yours,</p>
          <input
            type="text"
            value={name}
            onChange={(e) => onUpdate("name", e.target.value)}
            placeholder="(your name)"
            disabled={isLocked}
            aria-label="Your name"
            className="
              w-full max-w-[60%]
              bg-transparent border-0 outline-none
              font-script text-2xl md:text-3xl
              text-blood placeholder:text-ink/25
              focus:ring-0
              disabled:opacity-60
            "
          />
          <input
            type="email"
            value={email}
            onChange={(e) => onUpdate("email", e.target.value)}
            placeholder="(your email — for the reply)"
            disabled={isLocked}
            aria-label="Your email"
            className="
              w-full max-w-[80%]
              bg-transparent border-0 outline-none
              font-sans text-xs md:text-sm
              text-ink/70 placeholder:text-ink/25 italic
              focus:ring-0
              disabled:opacity-60
            "
          />
        </div>

        {/* Send action — printed at the foot of the page */}
        <div className="mt-3 pt-3 border-t border-ink/10 flex items-center justify-between">
          <p
            className={`
              font-sans text-[10px] uppercase tracking-[0.3em]
              ${
                status === "error"
                  ? "text-blood"
                  : "text-ink/40"
              }
            `}
            role="status"
            aria-live="polite"
          >
            {status === "error" && errorMsg
              ? errorMsg
              : status === "sending"
              ? "Sealing the envelope…"
              : status === "success"
              ? "Sent. Thank you."
              : "Sealed with intent."}
          </p>

          <button
            type="submit"
            disabled={isLocked}
            className="
              font-display text-blood text-base md:text-lg uppercase
              tracking-[0.15em]
              hover:text-oxblood
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-blood focus-visible:ring-offset-2
              focus-visible:ring-offset-bone
            "
          >
            ↳ send letter
          </button>
        </div>
      </form>
    </div>
  );
});

export default Letter;