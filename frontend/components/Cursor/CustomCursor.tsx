'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top  = `${my}px`;
      }
    };

    const animate = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top  = `${ry}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.closest('button') ||
        t.closest('a') ||
        t.closest('[data-tilt]') ||
        t.closest('[data-cursor-expand]')
      ) {
        setHovering(true);
      }
    };
    const onLeave = () => setHovering(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          width:  hovering ? 52 : 36,
          height: hovering ? 52 : 36,
          border: `2px solid var(--fire-${hovering ? 'orange' : 'red'})`,
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          transition: 'width .25s, height .25s, border-color .2s, background .2s',
          background: hovering ? 'rgba(232,52,26,0.06)' : 'transparent',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          width:  7,
          height: 7,
          background: 'var(--fire-amber)',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
    </>
  );
}
