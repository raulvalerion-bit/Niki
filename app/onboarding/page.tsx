import Link from 'next/link';

export const metadata = { title: 'Empezá tu Check de Presencia — niki' };

// PENDIENTE (anotado en ESTADO.md): el onboarding real se construye en la
// siguiente sesión de la secuencia maestra. Este stub existe solo para que el
// CTA de la landing no lleve a un 404 mientras tanto.
export default function OnboardingStub() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg)] px-6 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
        Próximamente
      </p>
      <h1 className="max-w-md text-2xl font-bold [font-family:var(--font-display)]">
        El onboarding de niki se está construyendo
      </h1>
      <p className="max-w-sm text-base text-[var(--text-secondary)]">
        Volvé pronto para hacer tu primer Check de Presencia.
      </p>
      <Link href="/" className="mt-2 text-sm font-medium text-[var(--accent)] underline">
        ← Volver a niki
      </Link>
    </main>
  );
}
