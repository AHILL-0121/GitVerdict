'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  slug: string;
}

export default function ShareButton({ slug }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/r/${slug}`
      : `/r/${slug}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl;
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
      onClick={handleShare}
      whileHover={{ rotate: -3 }}
      whileTap={{ scale: 0.95 }}
      aria-label={copied ? 'Share link copied!' : 'Copy share link to clipboard'}
      style={{
        fontSize: '0.7rem',
        fontWeight: 500,
        letterSpacing: '0.08em',
        padding: '6px 14px',
        background: copied ? 'rgba(245,200,66,0.15)' : 'transparent',
        border: `1px solid ${copied ? 'var(--fire-amber)' : 'var(--border)'}`,
        borderRadius: 8,
        color: copied ? '#9A7200' : 'var(--ink-muted)',
        cursor: 'none',
        transition: 'all .2s',
        fontFamily: "'DM Sans', sans-serif",
        textTransform: 'uppercase',
      }}
    >
      {copied ? '✓ LINK COPIED' : '🔗 SHARE'}
    </motion.button>
  );
}
