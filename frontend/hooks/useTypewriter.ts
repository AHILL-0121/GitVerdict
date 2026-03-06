'use client';

import { useEffect, useState } from 'react';

export function useTypewriter(text: string, speed = 18, active = true) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);

  return displayed;
}
