'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  count: number;
  status: string;
}

const CYCLE_MESSAGES = [
  'Fetching evidence...',
  'Preparing the roast...',
  'Almost ready to destroy you...',
];

export default function CommitCounter({ count, status }: Props) {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.p
        key={count}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.85rem',
          color: 'var(--ink-secondary)',
          letterSpacing: '0.04em',
        }}
      >
        {count > 0 ? `Reading ${count} crime${count !== 1 ? 's' : ''}...` : status}
      </motion.p>
    </div>
  );
}
