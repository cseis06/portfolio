"use client";

interface RollingLabelProps {
  children: React.ReactNode;
  hoverText?: React.ReactNode;
  className?: string;
}

export default function RollingLabel({
  children,
  hoverText,
  className = "",
}: RollingLabelProps) {
  return (
    <span
      className={`relative inline-flex overflow-hidden leading-none ${className}`}
    >
      <span
        aria-hidden="true"
        className="
          block translate-y-0 skew-y-0
          transition duration-500 ease-out
          group-hover:translate-y-[-160%] group-hover:skew-y-12
        "
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="
          absolute left-0 top-0
          translate-y-[164%] skew-y-12
          transition duration-500 ease-out
          group-hover:translate-y-0 group-hover:skew-y-0
        "
      >
        {hoverText ?? children}
      </span>
    </span>
  );
}