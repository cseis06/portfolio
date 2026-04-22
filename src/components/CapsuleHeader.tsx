"use client";

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
      className="relative w-[48px] h-[26px] rounded-full cursor-pointer p-0 shrink-0 transition-all duration-300"
      style={{
        border: `1px solid ${isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"}`,
        background: isDark ? "rgba(250,245,240,0.05)" : "rgba(26,22,20,0.05)",
      }}
    >
      <span
        className="absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all duration-300 flex items-center justify-center text-[10px] leading-none"
        style={{
          left: isDark ? "3px" : "25px",
          background: isDark
            ? "rgba(250,245,240,0.8)"
            : "rgba(26,22,20,0.8)",
          color: isDark ? "#0c0a09" : "#faf5f0",
        }}
      >
        {isDark ? "☽" : "☀"}
      </span>
    </button>
  );
}

export default function CapsuleHeader() {
  const { isDark } = useThemeStore();

  const textColor = isDark ? "rgba(250,245,240,0.55)" : "rgba(26,22,20,0.5)";
  const textHover = "#dc2626";
  const hoverBg = "rgba(220,38,38,0.06)";
  const dividerColor = isDark ? "rgba(250,245,240,0.08)" : "rgba(26,22,20,0.08)";

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

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.75); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes dividerGrow {
          from { opacity: 0; transform: scaleY(0); }
          to { opacity: 1; transform: scaleY(1); }
        }

        @keyframes crtSweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes recPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .capsule-shell {
          animation: capsuleAppear 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .header-rec {
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
          transition: color 0.3s, background 0.3s, letter-spacing 0.3s;
        }

        .header-toggle {
          opacity: 0;
          animation: fadeScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 1.38s forwards;
        }
      `}</style>

      <div
        className="capsule-shell relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          height: 48,
          padding: "10px 28px",
          gap: 8,
          opacity: 0,
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          background: isDark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.55)",
          border: `1px solid ${isDark ? "rgba(250,245,240,0.06)" : "rgba(26,22,20,0.06)"}`,
          boxShadow: isDark
            ? "0 8px 30px rgba(0,0,0,0.3)"
            : "0 8px 30px rgba(0,0,0,0.04)",
          transition: "background 0.5s, border-color 0.5s, box-shadow 0.5s",
        }}
      >
        {/* Scanlines */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-[1]"
          style={{
            opacity: 0.025,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)",
          }}
        />

        {/* CRT sweep */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-[1]">
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, transparent 0%, rgba(220,38,38,0.03) 40%, rgba(220,38,38,0.06) 50%, rgba(220,38,38,0.03) 60%, transparent 100%)",
              animation: "crtSweep 4s linear infinite",
            }}
          />
        </div>

        {/* REC dot */}
        <div className="header-rec flex items-center gap-1.5 z-[2]">
          <span
            className="block w-[7px] h-[7px] rounded-full shrink-0"
            style={{
              background: "#dc2626",
              animation: "recPulse 2s ease-in-out infinite",
            }}
          />
          <span
            className="text-[10px] font-medium mr-1"
            style={{
              letterSpacing: "0.18em",
              color: "#dc2626",
              fontFamily: "var(--font-mono)",
            }}
          >
            REC
          </span>
        </div>

        {/* Divider 1 */}
        <div
          className="header-divider header-divider-1 h-4 shrink-0"
          style={{ width: 1, background: dividerColor }}
        />

        {/* Nav Items */}
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            className="header-nav-item relative text-[12px] font-normal py-1.5 px-3.5 rounded-full whitespace-nowrap cursor-pointer no-underline z-[2]"
            style={{
              letterSpacing: "0.05em",
              color: textColor,
              fontFamily: "var(--font-mono)",
              animationDelay: `${1.05 + i * 0.08}s`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.color = textHover;
              el.style.background = hoverBg;
              el.style.letterSpacing = "0.12em";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.color = textColor;
              el.style.background = "transparent";
              el.style.letterSpacing = "0.05em";
            }}
          >
            {item.label}
          </a>
        ))}

        {/* Divider 2 */}
        <div
          className="header-divider header-divider-2 h-4 shrink-0 ml-0.5"
          style={{ width: 1, background: dividerColor }}
        />

        {/* Theme Toggle */}
        <div className="header-toggle">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}