'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Blaze from '@/components/Blaze/Blaze';
import CommitCounter from './CommitCounter';

interface Props {
  visible: boolean;
  commitCount: number;
  status: string;
}

const CYCLE_MSGS = [
  'Fetching evidence...',
  'Scoring the crimes...',
  'Preparing the roast...',
  'Almost ready to destroy you...',
];

export default function RoastLoader({ visible, commitCount, status }: Props) {
  const [progress, setProgress]   = useState(0);
  const [msgIndex, setMsgIndex]   = useState(0);

  useEffect(() => {
    if (!visible) { setProgress(0); setMsgIndex(0); return; }

    const pInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 8, 92));
    }, 400);

    const mInterval = setInterval(() => {
      setMsgIndex(i => (i + 1) % CYCLE_MSGS.length);
    }, 1800);

    return () => { clearInterval(pInterval); clearInterval(mInterval); };
  }, [visible]);

  // Jump to 100 when done
  useEffect(() => {
    if (status === 'done' || status === 'error') setProgress(100);
  }, [status]);

  const blazeState = status === 'fetching' ? 'loading' : 'roasting';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9990,
            background: 'var(--bg-base)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
          aria-live="polite"
          aria-label="Loading — roasting your commits"
        >
          {/* Grain overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
            opacity: 0.028,
          }} />

          <Blaze state={blazeState} size={90} />

          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.4rem',
            letterSpacing: '0.1em',
            color: 'var(--ink-primary)',
          }}>
            READING THE EVIDENCE
          </p>

          <CommitCounter count={commitCount} status={CYCLE_MSGS[msgIndex]} />

          {/* Progress bar */}
          <div style={{
            width: 260, height: 4,
            background: 'var(--border)',
            borderRadius: 9999,
            overflow: 'hidden',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--fire-orange), var(--fire-red))',
                borderRadius: 9999,
                position: 'relative',
                overflow: 'hidden',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <motion.div
                style={{
                  position: 'absolute', top: 0,
                  width: 40, height: '100%',
                  background: 'rgba(255,255,255,0.35)',
                  borderRadius: 9999,
                  filter: 'blur(4px)',
                }}
                animate={{ x: ['-40px', '300px'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
