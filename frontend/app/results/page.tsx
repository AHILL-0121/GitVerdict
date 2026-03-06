'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useRoastStore } from '@/hooks/useRoastStore';
import HallOfShame from '@/components/Results/HallOfShame';
import SummaryBar from '@/components/Results/SummaryBar';
import Blaze from '@/components/Blaze/Blaze';
import BlazeSpeechBubble from '@/components/Blaze/BlazeSpeechBubble';

export default function ResultsPage() {
  const router = useRouter();
  const { state, dispatch } = useRoastStore();
  const { session } = state;

  // Redirect if no session
  useEffect(() => {
    if (state.status !== 'done' || !session) {
      router.replace('/');
    }
  }, [state.status, session, router]);

  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Nav ── */}
      <nav className="gv-nav">
        <button
          onClick={() => {
            dispatch({ type: 'RESET' });
            router.push('/');
          }}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '1.5rem',
            letterSpacing: '0.04em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink-primary)',
            padding: 0,
          }}
        >
          GitVerdict
        </button>
        <div className="gv-nav-links">
          <button
            onClick={() => { dispatch({ type: 'RESET' }); router.push('/'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}
          >
            ← Roast another
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '7rem 1.5rem 6rem' }}>
        {/* ── Results header with BLAZE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <div style={{ position: 'relative' }}>
                <BlazeSpeechBubble state={session.blazeState} visible={true} />
              </div>
              <Blaze state={session.blazeState} size={140} />
            </div>

            <div style={{ textAlign: 'left' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'var(--ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                Verdict for
              </p>
              <h1 style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                lineHeight: 1,
                color: 'var(--ink-primary)',
                letterSpacing: '0.02em',
              }}>
                {session.repo}
              </h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'var(--ink-secondary)', marginTop: '0.4rem' }}>
                {session.totalCommits.toLocaleString()} commits scanned · top {session.commits.length} roasted
              </p>
            </div>
          </div>

          {/* Summary stats bar */}
          <SummaryBar
            repo={session.repo}
            totalCommits={session.totalCommits}
            roastedCount={session.commits.length}
            averageScore={session.averageScore}
          />
        </motion.div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <hr className="gv-divider" />
        </div>

        {/* ── Hall of Shame grid ── */}
        <HallOfShame session={session} slug={session.id} />
      </main>

      <footer className="gv-footer">
        <span>GitVerdict — we judge so your PR reviewer doesn't have to.</span>
      </footer>
    </div>
  );
}
