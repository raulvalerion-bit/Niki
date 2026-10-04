'use client';

import { useEffect } from 'react';
import { guardarOrigen } from '@/lib/origen';

/** Anota la red de origen (?src=) en cualquier página de entrada. No pinta nada. */
export function CapturaOrigen() {
  useEffect(() => {
    guardarOrigen(window.location.search);
  }, []);
  return null;
}
