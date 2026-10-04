'use client';

// LANDING DE NIKI — compuesta desde components/landing/ (kit canónico de 19-PAGINA-DE-VENTAS.md)
// Copy marcado y su trazabilidad a FICHA-AVATAR.md: docs/copy/landing.md
// Tokens visuales: components/landing/tokens.css (tematizado desde FICHA-ARTE.md)

import { Frown, EyeOff, Camera, ShieldAlert } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';
import { motion, useReducedMotion } from 'motion/react';
import { AnilloCaptura } from '@/components/landing/AnilloCaptura';
import { LogoAnillo } from '@/components/landing/LogoAnillo';

// Modelo 2 (onboarding-first, variante anónima — ESTADO.md): el CTA lleva a /onboarding,
// nunca al checkout desde el hero. El pago se cierra en el paywall in-app.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Hacer mi Check de Presencia gratis';

export default function LandingNiki() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="niki"
        logo={<LogoAnillo lado={28} />}
        loginHref="/login"
        h1Marked="Revisa si tu outfit e imagen brillan en [acento]30 segundos[/acento]"
        subtitleMarked="Niki analiza tu outfit, postura y actitud — [b]sin críticas crueles[/b]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Prueba VIP gratis de 3 días · tus fotos son privadas: solo tú las ves</span>}
        visual={
          <div className="flex justify-center bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] py-8">
            <div className="relative">
            {/* Captura real de la app (pantalla de resultado, datos de ejemplo) — 2026-09-28 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/capturas/resultado.jpg"
              alt="Así se ve tu Check de Presencia: puntaje 7.3 de 10, tu ajuste clave y tus notas de outfit, postura y actitud"
              width={250}
              height={542}
              fetchPriority="high"
              className="w-[250px] rounded-[30px] border-[5px] border-[color-mix(in_oklab,var(--text-primary)_90%,var(--accent))] shadow-[var(--shadow-2)]"
            />
            <AnilloCaptura puntaje={7.3} bordeMarco={5} centroX={189} centroY={256} />
            {/* Mascota Niki (FICHA-ARTE) saludando desde el borde del teléfono */}
            <motion.img
              src="/iconos/niki-saludando.webp"
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              className="absolute -right-8 top-[40px] size-16 drop-shadow-[0_6px_12px_rgba(60,36,18,0.22)]"
              initial={reduce ? false : { scale: 0.7, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22, delay: 0.5 }}
            />
            </div>
          </div>
        }
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          {
            icon: EyeOff,
            textoMarked:
              '¿Algo no te queda y [b]nadie te lo dice[/b] por pena?',
          },
          {
            icon: Frown,
            textoMarked: '¿No sabes cómo combinar tu ropa ni qué le favorece a tu cuerpo?',
          },
          {
            icon: ShieldAlert,
            textoMarked:
              '¿Te aterra arruinar una cita o entrevista por cómo te ves?',
          },
          {
            icon: Camera,
            textoMarked: '¿Tu mirada y tu postura transmiten debilidad y no sabes corregirlo?',
          },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Pierdes horas dudando frente al espejo — y oportunidades por una presencia que no refleja lo que vales.',
          'En [acento]6 meses[/acento], si nada cambia, sigues exactamente en el mismo lugar — pero con 6 meses menos.',
          'TikTok no conoce tu cuerpo; tus amigos dicen "te ves bien" por compromiso: [b]nadie te dice la verdad[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: '20-30 minutos de duda frente al armario, sin saber si vas a destacar.',
          labelFuturo: 'En 6 meses',
          futuro: 'Sigues saliendo con la misma duda, y nadie te dice qué ajustar.',
        }}
      />

      {/* 4. SOLUCIÓN — el Check de Presencia */}
      <Solucion
        tituloMarked="Tu presencia, resuelta [acento]antes de cruzar la puerta[/acento]"
        mecanismo="el Check de Presencia"
        bigIdeaMarked="No te falta estilo — te faltaba una retroalimentación honesta a tiempo. El Check de Presencia te la da en 30 segundos, con [b]tono de coach, no de juez[/b]."
        pasos={[
          { titulo: 'Subes tu foto', detalle: 'Elige la ocasión: entrevista, primera cita, reunión, salida con amigos, cena formal o vacaciones.' },
          { titulo: 'Niki analiza', detalle: 'Outfit, postura y actitud — los 3 ejes de tu presencia.' },
          { titulo: 'Recibes 3 ajustes', detalle: 'Concretos, accionables, listos para aplicar hoy.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Te enteras de que algo no funcionaba cuando ya estás en la cita.',
          labelDespues: 'Después',
          despues: 'Sabes exactamente qué ajustar — y sales con certeza.',
        }}
      />

      {/* 5. LA APP POR DENTRO — capturas reales de la app (datos de ejemplo), 2026-09-28 */}
      <AppPorDentro
        tituloMarked="¡Así se ve tu [acento]Check de Presencia[/acento]!"
        frames={[
          { src: '/capturas/ocasion.jpg', label: 'Eliges tu ocasión y subes tu foto' },
          { src: '/capturas/resultado.jpg', label: 'Tu puntaje y tu ajuste clave' },
          { src: '/capturas/resultado-ejes.jpg', label: 'Outfit, postura y actitud, explicados' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA — un plan (VIP Pro), anual y mensual; trial de 3 días SOLO en el Anual (igual que el paywall) */}
      <Oferta
        tituloMarked="Empieza gratis. Luego, [acento]menos de $0.30 al día[/acento]"
        trialDias={3}
        trialEnMensual={false}
        stack={{
          lineas: [
            { resultado: '3 Checks de Presencia al día (12 meses)', valor: '$120' },
            { resultado: 'Modo Alto Impacto para entrevistas, citas y reuniones', valor: '$39' },
            { resultado: 'Racha Glow-Up de 21 días', valor: '$27' },
          ],
          totalTachado: '$186',
          nota: 'Hoy: $8.99/mes',
          notaSub: 'Se cobra $107.88 al año',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'MÁS POPULAR',
          precioMes: '$8.99',
          totalAnual: 'Se cobra $107.88 al año',
          ahorro: '~5 meses gratis',
          ctaLabel: 'Hacer mi Check gratis',
          ctaHref: CTA_HREF,
          features: [
            'Hasta 3 Checks de Presencia al día',
            'Modo Alto Impacto para tus eventos',
            'Racha Glow-Up y seguimiento de hábitos',
            'Historial completo de tus Checks',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$14.99',
          ctaLabel: 'Elegir mensual',
          descomposicionDia: 'Se cobra hoy, sin prueba gratis',
          ctaHref: CTA_HREF,
          features: [
            'Hasta 3 Checks de Presencia al día',
            'Modo Alto Impacto para tus eventos',
            'Racha Glow-Up y seguimiento de hábitos',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="Garantía del Primer Ajuste Honesto"
        condicionMarked="Si tu primer Check de Presencia no te da al menos [b]1 ajuste concreto que puedas aplicar hoy[/b], escribes un correo y te devolvemos todo. Sin preguntas."
        pisoLegal="Respaldada por la garantía Hotmart de 7 días"
      />

      {/* 8. FAQ — objeciones literales de FICHA-AVATAR.md */}
      <Faq
        items={[
          {
            pregunta: '¿Una IA me va a dar consejos genéricos de robot?',
            respuestaMarked:
              'No. Analiza [b]TU foto real y tu ocasión[/b] — nunca reglas genéricas de moda.',
          },
          {
            pregunta: '¿Mis fotos quedan guardadas o se comparten?',
            respuestaMarked:
              'Se guardan en tu cuenta de forma privada para armar tu historial: [b]solo tú puedes verlas[/b]. Nunca se comparten con otros usuarios, no se venden y no se usan para entrenar nada público.',
          },
          {
            pregunta: '¿Me va a destrozar con una nota cruel tipo 3/10?',
            respuestaMarked:
              'Nunca. Ves tu puntaje de presencia, pero siempre con lo que ya te funciona y [b]ajustes concretos con tono de coach[/b]. Y jamás opina de tu cuerpo o tu cara: solo de lo que puedes cambiar hoy.',
          },
          {
            pregunta: 'Ya gasté dinero en ropa antes y no cambió nada, ¿por qué esto sí?',
            respuestaMarked:
              'Porque el problema no era tu ropa: era no saber leer tu postura y tu actitud a tiempo. Y aquí arriesgas poco: [b]3 días gratis[/b], luego menos de $0.30 al día, con la Garantía del Primer Ajuste Honesto.',
          },
          {
            pregunta: '¿Es seguro pagar?',
            respuestaMarked: 'Sí. El pago se procesa por Hotmart, una de las plataformas de pago más usadas en Latinoamérica, con tarjeta de débito o crédito.',
          },
        ]}
      />

      {/* 9. CTA FINAL EMOCIONAL */}
      <CtaFinal
        mascotaSrc="/iconos/niki-celebrando.webp"
        h2Marked="Imagina entrar y que [acento]todos lo noten[/acento]"
        futurePacingMarked="Subes tu foto antes de salir, ves tus 3 ajustes en 30 segundos, y cruzas la puerta sabiendo que vas a destacar."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Prueba VIP gratis de 3 días · Garantía del Primer Ajuste Honesto · Sin críticas crueles, nunca"
        psMarked="PS: Niki analiza tu outfit, postura y actitud en 30 segundos con el Check de Presencia — honesto, pero sin crueldad. Hoy entras con 3 días de prueba gratis y la Garantía del Primer Ajuste Honesto: si no te sirve, te devolvemos todo."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="niki"
        logo={<LogoAnillo lado={22} />}
        soporteEmail="hola@holaniki.com"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      {/* Sticky CTA mobile */}
      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
