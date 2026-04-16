"use client";

import { useRef } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "About Me", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function ThemeToggle() {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-[52px] h-[28px] rounded-full cursor-pointer p-0 shrink-0 transition-all duration-300"
      style={{
        border: `1px solid ${isDark ? "rgba(129,140,248,0.25)" : "rgba(236,72,153,0.3)"}`,
        background: isDark ? "rgba(129,140,248,0.1)" : "rgba(236,72,153,0.1)",
      }}
    >
      <span
        className="absolute top-[3px] w-[20px] h-[20px] rounded-full transition-all duration-300 flex items-center justify-center text-[11px] leading-none"
        style={{
          left: isDark ? "3px" : "27px",
          background: isDark
            ? "linear-gradient(135deg, #818cf8, #6366f1)"
            : "linear-gradient(135deg, #f472b6, #ec4899)",
        }}
      >
        {isDark ? "☽" : "☀"}
      </span>
    </button>
  );
}

export default function CapsuleHeader() {
  const { isDark } = useThemeStore();

  return (
    <header className="w-full flex justify-center pt-6 px-4 fixed top-0 z-50">
      <style>{`
        @keyframes capsuleAppear {
          0% {
            opacity: 0;
            transform: scale(0.5);
            clip-path: inset(0 calc(50% - 24px) 0 calc(50% - 24px) round 24px);
          }
          40% {
            opacity: 1;
            transform: scale(1);
            clip-path: inset(0 calc(50% - 24px) 0 calc(50% - 24px) round 24px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            clip-path: inset(0 0 0 0 round 24px);
          }
        }

        @keyframes crtSweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeScaleIn {
          from {
            opacity: 0;
            transform: scale(0.75);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes dividerGrow {
          from {
            opacity: 0;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        .capsule-shell {
          animation: capsuleAppear 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .header-brand {
          opacity: 0;
          animation: fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.85s forwards;
        }

        .header-divider {
          opacity: 0;
          transform-origin: center;
          animation: dividerGrow 0.25s ease-out forwards;
        }
        .header-divider-1 { animation-delay: 0.95s; }
        .header-divider-2 { animation-delay: 1.3s; }

        .header-nav-item {
          opacity: 0;
          animation: fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }


        .header-toggle {
          opacity: 0;
          animation: fadeScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 1.38s forwards;
        }

        .nav-link {
          transition: color 0.3s, background 0.3s, letter-spacing 0.3s;
        }
      `}</style>

      <div
        className="capsule-shell relative flex items-center justify-center rounded-full overflow-hidden transition-colors duration-500"
        style={{
          height: 48,
          padding: "10px 32px",
          gap: 8,
          opacity: 0,
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)",
          border: `1px solid ${isDark ? "rgba(129,140,248,0.12)" : "rgba(236,72,153,0.12)"}`,
          boxShadow: isDark
            ? "0 8px 30px rgba(0,0,0,0.25)"
            : "0 8px 30px rgba(0,0,0,0.05)",
        }}
      >
        {/* Static scanlines */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-[1]"
          style={{
            opacity: 0.03,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)",
          }}
        />

        {/* CRT sweep — a light band that scrolls top to bottom on loop */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-[1]">
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: isDark
                ? "linear-gradient(180deg, transparent 0%, rgba(129,140,248,0.07) 40%, rgba(129,140,248,0.12) 50%, rgba(129,140,248,0.07) 60%, transparent 100%)"
                : "linear-gradient(180deg, transparent 0%, rgba(236,72,153,0.06) 40%, rgba(236,72,153,0.1) 50%, rgba(236,72,153,0.06) 60%, transparent 100%)",
              animation: "crtSweep 3s linear infinite",
            }}
          />
        </div>

        {/* Brand */}
        <div className="header-brand flex items-center gap-1.5 z-[2]">
          <span
            className="block w-2 h-2 rounded-full shrink-0 animate-pulse"
            style={{ background: isDark ? "#818cf8" : "#ec4899" }}
          />
          <span
            className="text-[13px] font-medium mr-2"
            style={{
              letterSpacing: "0.15em",
              color: isDark ? "#818cf8" : "#ec4899",
            }}
          >
            ~/dev
          </span>
        </div>

        {/* Divider 1 */}
        <div
          className="header-divider header-divider-1 h-5 shrink-0"
          style={{
            width: 1,
            background: isDark ? "rgba(129,140,248,0.15)" : "rgba(236,72,153,0.2)",
          }}
        />

        {/* Nav Items */}
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            className="header-nav-item nav-link relative text-[13px] font-normal py-1.5 px-4 rounded-full whitespace-nowrap cursor-pointer no-underline z-2"
            style={{
              letterSpacing: "0.03em",
              color: isDark ? "rgba(255,255,255,0.7)" : "rgba(75,85,99,1)",
              animationDelay: `${1.05 + i * 0.08}s`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.color = isDark ? "#a5b4fc" : "#ec4899";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.color = isDark
                ? "rgba(255,255,255,0.7)"
                : "rgba(75,85,99,1)";
            }}
          >
            {item.label}
          </a>
        ))}

        {/* Divider 2 */}
        <div
          className="header-divider header-divider-2 h-5 shrink-0 ml-1"
          style={{
            width: 1,
            background: isDark ? "rgba(129,140,248,0.15)" : "rgba(236,72,153,0.2)",
          }}
        />

        {/* Theme Toggle */}
        <div className="header-toggle">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}