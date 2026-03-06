'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { BlazeState } from '@/types';

const SPEECH: Record<BlazeState, string> = {
  idle:           'Paste a repo URL. I dare you.',
  loading:        'Loading the evidence... oh no.',
  success:        "That's... actually not terrible. Almost.",
  error:          'The URL is as broken as your commits.',
  'not-found':    'Where did the repo go? Did it run from you?',
  nuclear:        "I'm calling the git police.",
  'rate-limited': 'GitHub cut me off. I was having so much fun.',
  empty:          'No commits? Bold strategy.',
  mild:           "I've seen worse. Barely.",
  done:           'I need a moment. This was a lot.',
  roasting:       "I'm reading these. This is painful.",
  spicy:          'Did you fall asleep on the keyboard?',
};

interface Props {
  state: BlazeState;
  visible?: boolean;
}

export default function BlazeSpeechBubble({ state, visible = true }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 0.8, x: 8 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          style={{
            position: 'absolute',
            right: '110%',
            top: '20px',
            background: 'var(--bg-elevated)',
            border: '1.5px solid var(--border)',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.8rem',
            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--ink-secondary)',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px var(--shadow-warm)',
            zIndex: 10,
          }}
          role="status"
          aria-live="polite"
        >
          {SPEECH[state]}
          {/* Tail pointing right to BLAZE */}
          <span
            style={{
              position: 'absolute',
              right: '-9px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '9px solid var(--border)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              right: '-7px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '8px solid var(--bg-elevated)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
