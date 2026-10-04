// Logo confirmado en FICHA-ARTE.md: el Anillo Niki (arco abierto + punto de luz) sobre
// su chip con degradé atardecer — la misma marca que usa la app por dentro.

export function LogoAnillo({ lado = 28 }: { lado?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-[8px]"
      style={{ width: lado, height: lado, background: 'linear-gradient(160deg, var(--sunset-1) 0%, var(--sunset-2) 100%)' }}
    >
      <svg width={lado / 2} height={lado / 2} viewBox="0 0 52 52" fill="none">
        <circle
          cx="26"
          cy="26"
          r="19"
          stroke="var(--text-primary)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="119.4"
          strokeDashoffset="28"
          transform="rotate(-90 26 26)"
        />
        <circle cx="26" cy="7.2" r="5" fill="var(--text-primary)" />
      </svg>
    </span>
  );
}
