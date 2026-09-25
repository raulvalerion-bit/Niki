import Link from 'next/link';

export const metadata = { title: 'Política de Reembolso — niki' };

export default function Reembolsos() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="text-sm font-medium text-[var(--accent)]">
        ← Volver a niki
      </Link>
      <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
        Política de Reembolso
      </h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Última actualización: 17 de septiembre de 2026 · v1
      </p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-[var(--text-secondary)]">
        <p>
          niki se vende a través de Hotmart. El reembolso se procesa según la ventana de garantía
          configurada para el producto en el panel de Hotmart — nunca prometemos un plazo distinto
          al configurado ahí.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">La Garantía del Primer Ajuste Honesto</h2>
          <p className="mt-2">
            Si tu primer Check de Presencia no te da al menos un ajuste concreto que puedas aplicar
            hoy, escribinos a{' '}
            <a href="mailto:hola@holaniki.com" className="text-[var(--accent)] underline">hola@holaniki.com</a>{' '}
            y te devolvemos todo. Sin preguntas, dentro de la ventana de reembolso vigente de Hotmart
            para tu compra (verificable en tu comprobante de compra).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cómo pedirlo</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Escríbenos a hola@holaniki.com con el email con el que compraste.</li>
            <li>
              O pedilo directo desde el portal del comprador de Hotmart:{' '}
              <a
                href="https://app.hotmart.com/comprador"
                className="text-[var(--accent)] underline"
                target="_blank"
                rel="noreferrer"
              >
                app.hotmart.com/comprador
              </a>
              .
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cómo cancelar tu suscripción</h2>
          <p className="mt-2">
            Podés cancelar en cualquier momento desde el portal del comprador de Hotmart (mismo enlace
            de arriba) o desde Ajustes dentro de la app. Cancelar detiene el próximo cobro; seguís
            teniendo acceso hasta el final del período ya pagado.
          </p>
        </section>
      </div>
    </main>
  );
}
