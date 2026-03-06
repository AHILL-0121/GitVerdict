'use client';

import { motion } from 'framer-motion';
import type { RoastSession } from '@/types';
import CommitCard from './CommitCard';
import SummaryBar from './SummaryBar';

interface Props {
  session: RoastSession;
  slug?: string;
}

export default function HallOfShame({ session, slug }: Props) {
  return (
    <section
      style={{ padding: '60px 24px 100px', maxWidth: 900, margin: '0 auto' }}
      aria-label="Hall of Shame results"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 24,
        }}
      >
        {/* Background watermark */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '6rem',
            color: 'var(--ink-primary)',
            opacity: 0.03,
            letterSpacing: '0.1em',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          HALL OF SHAME
        </span>

        <div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.78rem',
            color: 'var(--fire-orange)',
            marginBottom: 4,
          }}>
            github.com/{session.repo}
          </p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2rem',
            letterSpacing: '0.06em',
            color: 'var(--ink-primary)',
            margin: 0,
          }}>
            HALL OF SHAME
          </h2>
        </div>

        <SummaryBar
          repo={session.repo}
          totalCommits={session.totalCommits}
          roastedCount={session.commits.length}
          averageScore={session.averageScore}
        />
      </motion.div>

      {/* Cards grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {session.commits.map((commit, i) => (
          <CommitCard key={commit.sha} commit={commit} index={i} slug={slug} />
        ))}
      </div>
    </section>
  );
}
