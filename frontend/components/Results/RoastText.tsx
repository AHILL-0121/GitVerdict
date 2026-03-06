'use client';

import { useTypewriter } from '@/hooks/useTypewriter';

interface Props {
  text: string;
  active?: boolean;
}

export default function RoastText({ text, active = true }: Props) {
  const displayed = useTypewriter(text, 18, active);

  return (
    <p style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '0.95rem',
      color: 'var(--ink-secondary)',
      lineHeight: 1.65,
      margin: 0,
    }}>
      <span style={{ fontStyle: 'normal', fontWeight: 700, color: 'var(--fire-red)' }}>
        BLAZE SAYS:
      </span>{' '}
      &ldquo;{displayed}
      {displayed.length < text.length && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 2,
            height: '1em',
            background: 'var(--fire-orange)',
            marginLeft: 2,
            verticalAlign: 'middle',
            animation: 'blink-cursor 1s step-end infinite',
          }}
        />
      )}
      &rdquo;
    </p>
  );
}
