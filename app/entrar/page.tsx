import Link from 'next/link';

export const metadata = { title: 'Entrar — niki' };

// PENDIENTE (anotado en ESTADO.md): el login real llega en la Sesión de
// Login/Auth de la secuencia maestra (después de onboarding y paywall).
export default function EntrarStub() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg)] px-6 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
        Próximamente
      </p>
      <h1 className="max-w-md text-2xl font-bold [font-family:var(--font-display)]">
        El acceso a tu cuenta se está construyendo
      </h1>
      <Link href="/" className="mt-2 text-sm font-medium text-[var(--accent)] underline">
        ← Volver a niki
      </Link>
    </main>
  );
}
