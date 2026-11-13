'use client';

// Widget "no soy un robot" de Cloudflare Turnstile para el login. Modo
// 'interaction-only': casi nunca se ve, solo aparece si Cloudflare duda de la
// persona. El token es de UN solo uso: cada vez que `reinicio` cambia (después
// de pedir un código) se pide uno nuevo.

import { useEffect, useRef } from 'react';

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type Api = {
  render: (
    el: HTMLElement,
    opciones: {
      sitekey: string;
      appearance: 'interaction-only';
      language: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    }
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Api;
  }
}

function cargarScript(): Promise<void> {
  return new Promise((resolver, rechazar) => {
    if (window.turnstile) return resolver();
    const previo = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    const script = previo ?? document.createElement('script');
    script.addEventListener('load', () => resolver(), { once: true });
    script.addEventListener('error', () => rechazar(new Error('turnstile')), { once: true });
    if (!previo) {
      script.src = SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

export function TurnstileLogin({
  siteKey,
  reinicio,
  onToken,
}: {
  siteKey: string;
  reinicio: number;
  onToken: (token: string | null) => void;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const idWidget = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let cancelado = false;
    cargarScript()
      .then(() => {
        if (cancelado || !contenedor.current || !window.turnstile || idWidget.current) return;
        idWidget.current = window.turnstile.render(contenedor.current, {
          sitekey: siteKey,
          appearance: 'interaction-only',
          language: 'es',
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        });
      })
      .catch(() => onTokenRef.current(null));
    return () => {
      cancelado = true;
      if (idWidget.current && window.turnstile) window.turnstile.remove(idWidget.current);
      idWidget.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (reinicio > 0 && idWidget.current && window.turnstile) {
      onTokenRef.current(null);
      window.turnstile.reset(idWidget.current);
    }
  }, [reinicio]);

  return <div ref={contenedor} className="mx-auto mt-4 flex justify-center empty:hidden" />;
}
