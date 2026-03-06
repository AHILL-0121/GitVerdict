'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  text: string;
  label?: string;
}

export default function CopyRoast({ text, label = 'COPY ROAST' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.95 }}
      aria-label={copied ? 'Roast copied!' : 'Copy roast to clipboard'}
      style={{
        fontSize: '0.7rem',
        fontWeight: 500,
        letterSpacing: '0.08em',
        padding: '6px 12px',
        background: 'transparent',
        border: `1px solid ${copied ? '#3B7A57' : 'var(--border)'}`,
        borderRadius: 8,
        color: copied ? '#3B7A57' : 'var(--ink-muted)',
        cursor: 'none',
        transition: 'all .2s',
        fontFamily: "'DM Sans', sans-serif",
        textTransform: 'uppercase',
      }}
    >
      {copied ? '✓ COPIED' : label}
    </motion.button>
  );
}
