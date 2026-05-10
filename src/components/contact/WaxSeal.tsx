"use client";

import { forwardRef } from "react";
import Image from "next/image";

/**
 * The wax seal sprite. Hidden by default; positioned absolutely over
 * the letter. Animation is GSAP-driven from the parent — this is a
 * dumb visual.
 */
const WaxSeal = forwardRef<HTMLDivElement>(function WaxSeal(_props, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="
        absolute z-20
        w-[120px] md:w-[160px] aspect-square
        pointer-events-none
        opacity-0
      "
      style={{
        // Default position over letter footer-right; GSAP will tween from above
        bottom: "8%",
        right: "12%",
      }}
    >
      <Image
        src="/contact/seal.png"
        alt=""
        fill
        sizes="160px"
        className="object-contain"
        draggable={false}
      />
    </div>
  );
});

export default WaxSeal;