'use client';

import { motion } from 'framer-motion';
import type { Tier } from '@/types';

interface Props {
  score: number;
  tier: Tier;
}

const TIER_CONFIG = {
  nuclear: {
    label: 'NUCLEAR OFFENSE',
    bg:     'rgba(232,52,26,0.1)',
    color:  'var(--fire-red)',
    border: 'rgba(232,52,26,0.25)',
    dot:    'var(--fire-red)',
    icon:   '☢️',
  },
  spicy: {
    label: 'SPICY OFFENSE',
    bg:     'rgba(245,124,43,0.1)',
    color:  'var(--fire-orange)',
    border: 'rgba(245,124,43,0.25)',
    dot:    'var(--fire-orange)',
    icon:   '🔥',
  },
  mild: {
    label: 'MILD OFFENSE',
    bg:     'rgba(245,200,66,0.15)',
    color:  '#9A7200',
    border: 'rgba(245,200,66,0.4)',
    dot:    'var(--fire-amber)',
    icon:   '🌡️',
  },
};

export default function ShameScore({ score, tier }: Props) {
  const cfg = TIER_CONFIG[tier];

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 12px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 100,
        color: cfg.color,
      }}
      aria-label={`Shame score: ${score} out of 10 — ${cfg.label}`}
    >
      <span style={{ fontSize: '0.85rem' }}>{cfg.icon}</span>

      <motion.span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.1rem',
          lineHeight: 1,
          color: cfg.color,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {score}/10
      </motion.span>

      <span style={{
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        {cfg.label}
      </span>

      {/* Pulse dot */}
      <motion.span
        animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0.3, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: cfg.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
