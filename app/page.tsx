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

// Modelo 2 (onboarding-first, variante anónima — ESTADO.md): el CTA lleva a /onboarding,
// nunca al checkout desde el hero. El pago se cierra en el paywall in-app.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Hacer mi Check de Presencia gratis';

export default function LandingNiki() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="niki"
        loginHref="/login"
        h1Marked="Revisa si tu outfit e imagen son las mejores en [acento]30 segundos[/acento]"
        subtitleMarked="Niki analiza tu outfit, postura y actitud — [b]sin críticas crueles[/b]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Trial VIP de 3 días · tus fotos son privadas: solo tú las ves</span>}
        visualPlaceholderSugerencia="captura del Check de Presencia con el puntaje 82/100 y los 3 ajustes ya generados"
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          {
            icon: EyeOff,
            textoMarked:
              '¿Sientes que tu ropa se ve rara o fuera de lugar, pero [b]nadie te lo dice[/b] por pena?',
          },
          {
            icon: Frown,
            textoMarked: '¿No tienes ni idea de cómo combinar tu ropa ni qué le favorece a tu cuerpo?',
          },
          {
            icon: ShieldAlert,
            textoMarked:
              '¿Te da pánico ir mal vestido a una cita o entrevista y arruinar todo en 5 segundos?',
          },
          {
            icon: Camera,
            textoMarked: '¿Sientes que tu mirada y tu postura transmiten debilidad, sin saber cómo corregirlo?',
          },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada mes sigues perdiendo horas dudando frente al espejo — y varias oportunidades por una presencia que no refleja lo que vales.',
          'En [acento]6 meses[/acento], si nada cambia, sigues exactamente en el mismo lugar — pero con 6 meses menos.',
          'Los videos de TikTok no aplican a tu cuerpo real; tus amigos solo dicen "te ves bien" por compromiso: [b]ninguno te dice la verdad[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: '20-30 minutos de duda frente al armario, sin saber si vas a destacar.',
          labelFuturo: 'En 6 meses',
          futuro: '¡Seguirás siendo invisible, mientras otros brillan!',
        }}
      />

      {/* 4. SOLUCIÓN — el Check de Presencia */}
      <Solucion
        tituloMarked="Tu presencia, resuelta [acento]antes de cruzar la puerta[/acento]"
        mecanismo="el Check de Presencia"
        bigIdeaMarked="No te falta estilo — te faltaba una retroalimentación honesta a tiempo. El Check de Presencia te la da en 30 segundos, con [b]tono de coach, no de juez[/b]."
        pasos={[
          { titulo: 'Subes tu foto', detalle: 'Elige la ocasión: entrevista de trabajo, primera cita, reunión de negocios, salida con amigos, cena formal o vacaciones.' },
          { titulo: 'Niki analiza', detalle: 'Outfit, postura y actitud — los 3 ejes de tu presencia.' },
          { titulo: 'Recibes 3 ajustes', detalle: 'Concretos, accionables, listos para aplicar hoy.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Dudas frente al espejo sin saber si vas a destacar.',
          labelDespues: 'Después',
          despues: 'Sabes exactamente qué ajustar — y sales con certeza.',
        }}
      />

      {/* 5. LA APP POR DENTRO — placeholders honestos (app interna aún no construida) */}
      <AppPorDentro
        tituloMarked="¡Así se ve tu [acento]Check de Presencia[/acento]!"
        frames={[
          { label: 'Tu Check de Presencia de hoy', nombrePantalla: 'Hoy' },
          { label: 'Eliges tu ocasión', nombrePantalla: 'Onboarding' },
          { label: 'Tus 3 ejes explicados', nombrePantalla: 'Scan completo' },
          { label: 'Tu racha Glow-Up', nombrePantalla: 'Hábitos' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA — un plan (VIP Pro), anual y mensual; trial de 3 días SOLO en el Anual (igual que el paywall) */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]menos de $0.30 al día[/acento]"
        trialDias={3}
        trialEnMensual={false}
        stack={{
          lineas: [
            { resultado: 'Check de Presencia ilimitado (12 meses)', valor: '$120' },
            { resultado: 'Modo Alto Impacto para entrevistas, citas y reuniones', valor: '$39' },
            { resultado: 'Guía Glow-Up de 21 días', valor: '$27' },
          ],
          totalTachado: '$186',
          nota: 'Hoy: $8.99/mes (se cobra $107.88/año)',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'MÁS POPULAR',
          precioMes: '$8.99',
          totalAnual: 'Se cobra $107.88/año',
          ahorro: '~5 meses gratis',
          descomposicionDia: 'menos de $0.30 al día',
          ctaLabel: 'Empezar mi prueba gratis de 3 días',
          ctaHref: CTA_HREF,
          features: [
            'Check de Presencia ilimitado',
            'Modo Alto Impacto para tus eventos',
            'Racha Glow-Up y seguimiento de hábitos',
            'Historial completo de tus Scans',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$14.99',
          ctaLabel: 'Elegir mensual',
          descomposicionDia: 'Se cobra hoy, sin prueba gratis',
          ctaHref: CTA_HREF,
          features: [
            'Check de Presencia ilimitado',
            'Modo Alto Impacto para tus eventos',
            'Racha Glow-Up y seguimiento de hábitos',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="la Garantía del Primer Ajuste Honesto"
        condicionMarked="Si tu primer Check de Presencia no te da al menos [b]1 ajuste concreto que puedas aplicar hoy[/b], escribes un correo y te devolvemos todo. Sin preguntas."
        pisoLegal="Respaldada por la política de reembolso de Hotmart"
      />

      {/* 8. FAQ — objeciones literales de FICHA-AVATAR.md */}
      <Faq
        items={[
          {
            pregunta: '¿Una IA me va a dar consejos genéricos de robot?',
            respuestaMarked:
              'No. Analiza [b]TU foto, tu cuerpo y tu ocasión[/b] — nunca reglas genéricas de moda.',
          },
          {
            pregunta: '¿Mis fotos quedan guardadas o se comparten?',
            respuestaMarked:
              'Se guardan en tu cuenta de forma privada para armar tu historial: [b]solo tú puedes verlas[/b]. Nunca se comparten con otros usuarios, no se venden y no se usan para entrenar nada público.',
          },
          {
            pregunta: '¿Me va a destrozar con una nota cruel tipo 3/10?',
            respuestaMarked:
              'Nunca. Niki no pone notas frías: te da 3 ajustes concretos con [b]tono de coach[/b], siempre constructivo.',
          },
          {
            pregunta: 'Ya gasté plata en ropa antes y no cambió nada, ¿por qué esto sí?',
            respuestaMarked:
              'Porque el problema no era tu ropa: era no saber leer tu postura y tu actitud a tiempo. Eso es lo que Niki te muestra.',
          },
          {
            pregunta: '¿Es seguro pagar? ¿Hay cuotas?',
            respuestaMarked: 'Sí, el pago se procesa por Hotmart, con métodos locales según tu país.',
          },
        ]}
      />

      {/* 9. CTA FINAL EMOCIONAL */}
      <CtaFinal
        h2Marked="Imagina entrar y que [acento]todos lo noten[/acento]"
        futurePacingMarked="Subes tu foto antes de salir, ves tus 3 ajustes en 30 segundos, y cruzas la puerta sabiendo que vas a destacar."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Trial VIP de 3 días · Garantía del Primer Ajuste Honesto · Sin críticas crueles, nunca"
        psMarked="PS: Niki analiza tu outfit, postura y actitud en 30 segundos con el Check de Presencia — sin números fríos ni crueldad. Hoy entras con 3 días de prueba gratis y la Garantía del Primer Ajuste Honesto: si no te sirve, te devolvemos todo."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="niki"
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
