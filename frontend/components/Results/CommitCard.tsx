'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Commit } from '@/types';
import ShameScore from './ShameScore';
import RoastText from './RoastText';
import CopyRoast from '@/components/Share/CopyRoast';
import ShareButton from '@/components/Share/ShareButton';

interface Props {
  commit: Commit;
  index: number;
  slug?: string;
}

export default function CommitCard({ commit, index, slug }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const dateStr = new Date(commit.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  const timeStr = new Date(commit.date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <motion.div
      ref={cardRef}
      data-tilt="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        willChange: 'transform',
        perspective: 1000,
        rotateX: tilt.x,
        rotateY: tilt.y,
        transition: tilt.x === 0 ? 'transform 0.5s ease' : undefined,
        boxShadow: `0 4px 24px var(--shadow-warm)`,
        cursor: 'none',
      }}
      whileHover={{ borderColor: 'var(--fire-orange)', boxShadow: '0 16px 48px var(--shadow-warm)' }}
    >
      {/* Hover glow overlay */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(245,124,43,0.04) 0%, transparent 60%)',
          opacity: 0, borderRadius: 16,
        }}
        whileHover={{ opacity: 1 }}
      />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <ShameScore score={commit.score} tier={commit.tier} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {commit.roast && <CopyRoast text={`[${commit.tier.toUpperCase()}] "${commit.message}" — BLAZE SAYS: "${commit.roast}"`} />}
          {slug && <ShareButton slug={slug} />}
        </div>
      </div>

      {/* Commit message */}
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.9rem',
        fontWeight: 500,
        color: 'var(--ink-primary)',
        margin: '0 0 6px 0',
        lineHeight: 1.5,
        wordBreak: 'break-word',
      }}>
        &ldquo;{commit.message}&rdquo;
      </p>

      {/* Meta */}
      <p style={{
        fontSize: '0.78rem',
        color: 'var(--ink-muted)',
        margin: '0 0 18px 0',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <span style={{ color: 'var(--fire-orange)', fontFamily: "'JetBrains Mono', monospace" }}>
          {commit.sha}
        </span>
        {' · '}
        {commit.author}
        {' · '}
        {timeStr} · {dateStr}
      </p>

      {/* Roast box */}
      {commit.roast ? (
        <div style={{
          background: 'var(--bg-base)',
          border: '1.5px dashed var(--fire-ember)',
          borderRadius: 10,
          padding: '16px 16px 12px',
          position: 'relative',
          marginBottom: 4,
        }}>
          <span style={{
            position: 'absolute', top: -10, left: 14,
            background: 'var(--bg-base)',
            padding: '0 6px',
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--fire-ember)',
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            🔥 Verdict
          </span>
          <RoastText text={commit.roast} active={true} />
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-base)',
          border: '1.5px dashed var(--border)',
          borderRadius: 10,
          padding: '12px 16px',
          color: 'var(--ink-muted)',
          fontSize: '0.82rem',
          fontStyle: 'italic',
        }}>
          BLAZE is rendering the verdict…
        </div>
      )}
    </motion.div>
  );
}
