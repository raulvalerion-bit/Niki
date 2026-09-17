import Link from 'next/link';

export const metadata = { title: 'Privacidad — niki' };

export default function Privacidad() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="text-sm font-medium text-[var(--accent)]">
        ← Volver a niki
      </Link>
      <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
        Política de Privacidad
      </h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Última actualización: 17 de septiembre de 2026 · v1
      </p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-[var(--text-secondary)]">
        <p>
          Responsable del tratamiento: <strong className="text-[var(--text-primary)]">Raúl Valerio
          Nebradt</strong>, operando desde{' '}
          <strong className="text-[var(--text-primary)]">México</strong>. Contacto:{' '}
          <a href="mailto:hola@niki.app" className="text-[var(--accent)] underline">
            hola@niki.app
          </a>{' '}
          (dominio provisional hasta comprar el definitivo).
        </p>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Qué datos recopilamos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Datos de cuenta: nombre, email, y los datos que elijas darnos en el onboarding (edad, ocasión).</li>
            <li>Las fotos que subís para tu Check de Presencia.</li>
            <li>Datos de uso de la app (qué pantallas visitás, con qué frecuencia usás Niki).</li>
            <li>Datos de pago: los procesa Hotmart directamente — niki nunca ve ni guarda tu tarjeta.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cómo usamos tus fotos</h2>
          <p className="mt-2">
            Tu foto se envía a nuestro servidor, se analiza con un modelo de IA para generar tu Check
            de Presencia (outfit, postura y actitud) y el resultado se te muestra a vos. No usamos tus
            fotos para entrenar modelos públicos, no las mostramos a otros usuarios y no las vendemos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Con quién compartimos datos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong className="text-[var(--text-primary)]">Proveedor de IA</strong> — procesa tu foto para generar el análisis (subprocesador, bajo contrato de confidencialidad).</li>
            <li><strong className="text-[var(--text-primary)]">Supabase</strong> — base de datos y autenticación.</li>
            <li><strong className="text-[var(--text-primary)]">Vercel</strong> — hosting de la aplicación.</li>
            <li><strong className="text-[var(--text-primary)]">Resend</strong> — emails transaccionales (confirmación, recuperación de cuenta).</li>
            <li><strong className="text-[var(--text-primary)]">Hotmart</strong> — procesamiento de pagos y suscripción.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tus derechos</h2>
          <p className="mt-2">
            Podés pedir acceso, corrección o eliminación de tus datos (incluidas tus fotos) escribiendo
            a <a href="mailto:hola@niki.app" className="text-[var(--accent)] underline">hola@niki.app</a>.
            Respondemos en un plazo razonable según la ley de tu país.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cambios a esta política</h2>
          <p className="mt-2">
            Si hacemos un cambio material, te avisamos por email antes de que entre en vigencia.
          </p>
        </section>
      </div>
    </main>
  );
}
