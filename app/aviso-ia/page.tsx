import Link from 'next/link';

export const metadata = { title: 'Aviso de IA — niki' };

export default function AvisoIA() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="text-sm font-medium text-[var(--accent)]">
        ← Volver a niki
      </Link>
      <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
        Aviso de Inteligencia Artificial
      </h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Última actualización: 17 de septiembre de 2026 · v1
      </p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-[var(--text-secondary)]">
        <p className="rounded-2xl border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--surface)] p-6">
          <strong className="text-[var(--text-primary)]">
            El Check de Presencia es orientación generada por inteligencia artificial, no consejo
            profesional de imagen, psicológico ni médico.
          </strong>{' '}
          Sos vos quien decide qué aplicar.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cómo funciona</h2>
          <p className="mt-2">
            Tu foto se procesa con un modelo de IA que analiza outfit, postura y actitud, y genera
            3 sugerencias. El modelo puede equivocarse, ser impreciso, o no captar el contexto
            completo de tu situación — verificá siempre con tu propio criterio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Lo que niki nunca hace</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>No pone puntuaciones crueles ni comentarios sobre tu cuerpo fuera del outfit/postura/actitud.</li>
            <li>No comparte tus fotos con otros usuarios ni las publica.</li>
            <li>No sustituye una consulta médica, psicológica o de estilismo profesional si la necesitás.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Más información</h2>
          <p className="mt-2">
            Ver también la{' '}
            <Link href="/privacidad" className="text-[var(--accent)] underline">Política de Privacidad</Link>{' '}
            (qué hacemos con tus fotos) y los{' '}
            <Link href="/terminos" className="text-[var(--accent)] underline">Términos y Condiciones</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
