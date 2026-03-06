'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import HallOfShame from '@/components/Results/HallOfShame';
import SummaryBar from '@/components/Results/SummaryBar';
import Blaze from '@/components/Blaze/Blaze';
import BlazeSpeechBubble from '@/components/Blaze/BlazeSpeechBubble';
import type { RoastSession } from '@/types';

export default function SharePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [session, setSession] = useState<RoastSession | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const slug = params?.slug;
    if (!slug) { setNotFound(true); return; }

    try {
      const raw = localStorage.getItem(`gv:${slug}`);
      if (raw) {
        setSession(JSON.parse(raw) as RoastSession);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [params]);

  // ── 404 fallback ──
  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }}>
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <div style={{ position: 'relative' }}>
            <BlazeSpeechBubble state="not-found" visible={true} />
          </div>
          <Blaze state="not-found" size={140} />
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: 'var(--ink-primary)', letterSpacing: '0.02em' }}>
          Session not found
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--ink-secondary)', textAlign: 'center', maxWidth: '380px' }}>
          This roast has expired or was never saved. GitVerdict sessions live in local storage — they only travel with the browser.
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem 2rem',
            background: 'var(--fire-orange)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '1.1rem',
            letterSpacing: '0.06em',
            cursor: 'pointer',
          }}
        >
          Roast a new repo
        </button>
      </div>
    );
  }

  // ── Loading ──
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Blaze state="loading" size={120} />
      </div>
    );
  }

  // ── Share view ──
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="gv-nav">
        <button
          onClick={() => router.push('/')}
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
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}
          >
            Roast your own →
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '7rem 1.5rem 6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}
        >
          {/* Shared-by banner */}
          <p style={{
            display: 'inline-block',
            background: 'var(--fire-amber)',
            color: 'var(--ink-primary)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.3rem 1rem',
            borderRadius: '20px',
            marginBottom: '1.5rem',
          }}>
            Shared Roast
          </p>

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

        <HallOfShame session={session} slug={session.id} />
      </main>

      <footer className="gv-footer">
        <span>GitVerdict — we judge so your PR reviewer doesn't have to.</span>
      </footer>
    </div>
  );
}
