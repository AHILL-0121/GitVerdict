'use client';

import { motion } from 'framer-motion';

interface Props {
  repo: string;
  totalCommits: number;
  roastedCount: number;
  averageScore: number;
}

export default function SummaryBar({ repo, totalCommits, roastedCount, averageScore }: Props) {
  const stats = [
    { num: totalCommits, label: 'COMMITS REVIEWED' },
    { num: roastedCount, label: 'OFFENSES CHARGED' },
    { num: averageScore.toFixed(1), label: 'AVG SHAME SCORE' },
  ];

  return (
    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 * i, duration: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2rem',
            color: 'var(--fire-red)',
            lineHeight: 1,
          }}>
            {s.num}
          </div>
          <div style={{
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginTop: 2,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
