import { teamStyle } from "@/lib/ui/f1Style";

function initials(value?: string) {
  const parts = (value ?? "F1").split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function TeamLogo({ name, className = "" }: { name?: string; className?: string }) {
  const style = teamStyle(name);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[4px] border border-white/20 text-[0.62rem] font-black text-white shadow-[0_8px_22px_rgba(0,0,0,0.28)] ${className}`}
      style={{ backgroundColor: style.primary }}
      aria-label={`${name ?? "Team"} team mark`}
      title={name ?? "Team"}
    >
      {initials(name)}
    </span>
  );
}

export function DriverPortrait({ name, code, teamName, className = "" }: { name?: string; code?: string; teamName?: string; className?: string }) {
  const style = teamStyle(teamName);

  return (
    <svg className={className} viewBox="0 0 180 300" role="img" aria-label={`${name ?? code ?? "Driver"} portrait placeholder`}>
      <defs>
        <linearGradient id={`driver-${code ?? "f1"}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="45%" stopColor={style.primary} />
          <stop offset="100%" stopColor="#0b0c10" />
        </linearGradient>
      </defs>
      <rect x="34" y="82" width="112" height="194" rx="24" fill={`url(#driver-${code ?? "f1"})`} />
      <circle cx="90" cy="52" r="34" fill="#c58f71" />
      <path d="M58 48c8-30 58-34 70 0-16-13-45-14-70 0z" fill="#17171d" />
      <path d="M45 132h90l18 144H27l18-144z" fill={style.primary} opacity="0.88" />
      <path d="M72 128h36l8 148H64l8-148z" fill="#16171d" opacity="0.55" />
      <text x="90" y="224" textAnchor="middle" fill="white" fontSize="32" fontWeight="900">{code ?? initials(name)}</text>
    </svg>
  );
}

export function CarSilhouette({ teamName, className = "" }: { teamName?: string; className?: string }) {
  const style = teamStyle(teamName);

  return (
    <svg className={className} viewBox="0 0 520 150" role="img" aria-label={`${teamName ?? "Team"} car placeholder`}>
      <path d="M43 93h73l37-29h113l31 20h93c37 0 62 13 82 33H39c-13 0-18-15 4-24z" fill={style.primary} />
      <path d="M157 63h114l26 20H129l28-20z" fill="#ffffff" opacity="0.3" />
      <path d="M324 81l78-35h56l-28 53h-74l-32-18z" fill={style.primary} opacity="0.78" />
      <path d="M65 86h53L85 56H54l11 30z" fill="#ffffff" opacity="0.18" />
      <circle cx="137" cy="117" r="30" fill="#050508" />
      <circle cx="137" cy="117" r="18" fill="#cfd2d8" />
      <circle cx="420" cy="117" r="30" fill="#050508" />
      <circle cx="420" cy="117" r="18" fill="#cfd2d8" />
      <path d="M18 102h87v15H11c-18 0-12-15 7-15z" fill="#ffffff" opacity="0.65" />
      <text x="258" y="111" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="900">{initials(teamName)}</text>
    </svg>
  );
}
