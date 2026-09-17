import Link from 'next/link';

export const metadata = { title: 'Tu plan — niki' };

// PENDIENTE (anotado en ESTADO.md): el paywall real se construye en la
// siguiente sesión de la secuencia maestra (Paso 3). Este stub existe solo
// para que el CTA del onboarding no lleve a un 404 mientras tanto.
export default function PaywallStub() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg)] px-6 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
        Próximamente
      </p>
      <h1 className="max-w-md text-2xl font-bold [font-family:var(--font-display)]">
        Tu plan de <span className="text-[var(--accent)]">niki</span> se está construyendo
      </h1>
      <p className="max-w-sm text-base text-[var(--text-secondary)]">
        Ya viste cómo se va a ver tu Check de Presencia. Volvé pronto para desbloquearlo.
      </p>
      <Link href="/" className="mt-2 text-sm font-medium text-[var(--accent)] underline">
        ← Volver a niki
      </Link>
    </main>
  );
}
