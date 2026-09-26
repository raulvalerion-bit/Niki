import Link from 'next/link';

export const metadata = { title: 'Términos y Condiciones — niki' };

export default function Terminos() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="text-sm font-medium text-[var(--accent)]">
        ← Volver a niki
      </Link>
      <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
        Términos y Condiciones
      </h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Última actualización: 17 de septiembre de 2026 · v1
      </p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-[var(--text-secondary)]">
        <p>
          Estos Términos regulan el uso de niki, operada por{' '}
          <strong className="text-[var(--text-primary)]">Raúl Valerio Nebradt</strong>, desde México.
          Al crear una cuenta o usar la app, aceptas estos términos.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Qué es niki</h2>
          <p className="mt-2">
            niki es una app que analiza fotos de cuerpo entero con inteligencia artificial y ofrece
            retroalimentación sobre outfit, postura y actitud (el &quot;Check de Presencia&quot;), junto con
            hábitos diarios de presencia. niki NO es un servicio de asesoría de imagen profesional,
            psicológica ni médica — ver el <Link href="/aviso-ia" className="text-[var(--accent)] underline">Aviso de IA</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Acceso y suscripción</h2>
          <p className="mt-2">
            El acceso se vende como suscripción recurrente procesada por Hotmart. Se renueva
            automáticamente cada mes o año según el plan elegido — cancelás cuando quieras desde tu
            cuenta o el portal del comprador de Hotmart, sin que se te cobre el siguiente período.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Uso aceptable</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Solo subes fotos tuyas o de personas que te dieron permiso.</li>
            <li>No usas niki para generar contenido dañino, ofensivo o sobre menores de edad.</li>
            <li>Nos reservamos el derecho de suspender cuentas que violen estas condiciones.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Limitación de responsabilidad</h2>
          <p className="mt-2">
            Los resultados del Check de Presencia son orientación generada por IA, no una garantía de
            resultado social, profesional o romántico. Sos responsable de las decisiones que tomes a
            partir de esa orientación.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Ley aplicable</h2>
          <p className="mt-2">
            Estos términos se rigen por las leyes de{' '}
            <strong className="text-[var(--text-primary)]">México</strong>.
          </p>
        </section>
      </div>
    </main>
  );
}
