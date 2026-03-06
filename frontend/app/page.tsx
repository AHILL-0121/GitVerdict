'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoastStore } from '@/hooks/useRoastStore';
import RepoInput from '@/components/Input/RepoInput';
import Blaze from '@/components/Blaze/Blaze';
import BlazeSpeechBubble from '@/components/Blaze/BlazeSpeechBubble';
import RoastLoader from '@/components/Loader/RoastLoader';
import { scoreCommit, getTier, slugify } from '@/lib/scorer';
import type { BlazeState, Commit, RoastSession } from '@/types';

function statusToBlazeState(status: string, avgScore?: number): BlazeState {
  switch (status) {
    case 'fetching': return 'loading';
    case 'scoring':  return 'loading';
    case 'roasting': return 'roasting';
    case 'error':    return 'error';
    case 'done':
      if (!avgScore) return 'done';
      if (avgScore >= 8) return 'nuclear';
      if (avgScore >= 5) return 'spicy';
      if (avgScore >= 3) return 'mild';
      return 'success';
    default:         return 'idle';
  }
}

export default function HomePage() {
  const router = useRouter();
  const { state, dispatch } = useRoastStore();
  const [repoInput, setRepoInput] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const blazeState = statusToBlazeState(state.status, state.session?.averageScore);

  // If already done, send to results
  useEffect(() => {
    if (state.status === 'done' && state.session) {
      router.push('/results');
    }
  }, [state.status, state.session, router]);

  const handleSubmit = useCallback(async (repo: string) => {
    if (!repo || !repo.includes('/')) {
      dispatch({ type: 'FETCH_ERROR', error: 'Enter a valid GitHub repo (owner/repo).' });
      return;
    }

    setRepoInput(repo);
    dispatch({ type: 'SET_REPO', repo });
    dispatch({ type: 'FETCH_START' });

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // ── 1. Fetch commits ───────────────────────────────────────────
      const res = await fetch(`/api/commits?repo=${encodeURIComponent(repo)}`, {
        signal: controller.signal,
      });

      if (res.status === 404) {
        dispatch({ type: 'FETCH_ERROR', error: `Repo "${repo}" not found.` });
        return;
      }
      if (res.status === 429) {
        dispatch({ type: 'FETCH_ERROR', error: 'GitHub rate limit hit — try again in a minute.' });
        return;
      }
      if (!res.ok) {
        const msg = await res.text().catch(() => 'Unknown error');
        dispatch({ type: 'FETCH_ERROR', error: msg });
        return;
      }

      const data: { repo: string; total_fetched: number; commits: Array<{ sha: string; message: string; author: string; date: string }> } = await res.json();

      if (!data.commits?.length) {
        dispatch({ type: 'FETCH_ERROR', error: 'No commits found in this repo.' });
        return;
      }

      dispatch({ type: 'FETCH_PROGRESS', count: data.total_fetched });

      // ── 2. Score commits ──────────────────────────────────────────
      const scored: Commit[] = data.commits.map(c => {
        const score = scoreCommit(c.message, c.date);
        return { ...c, score, tier: getTier(score) };
      });

      // Sort worst first, cap at 10
      const top10 = [...scored].sort((a, b) => b.score - a.score).slice(0, 10);
      dispatch({ type: 'FETCH_SUCCESS', commits: top10 });

      // ── 3. Roast commits ──────────────────────────────────────────
      dispatch({ type: 'ROAST_START' });
      const roastRes = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commits: top10, repo }),
        signal: controller.signal,
      });

      if (roastRes.status === 429) {
        dispatch({ type: 'ROAST_ERROR', error: 'Roast rate limit hit — try again in a minute.' });
        return;
      }
      if (!roastRes.ok) {
        const msg = await roastRes.text().catch(() => 'Roast API failed');
        dispatch({ type: 'ROAST_ERROR', error: msg });
        return;
      }

      const { roasts }: { roasts: Array<{ sha: string; roast: string }> } = await roastRes.json();

      // Merge roasts into commits
      const roastedCommits: Commit[] = top10.map(c => {
        const r = roasts.find(x => x.sha === c.sha);
        return r ? { ...c, roast: r.roast } : c;
      });

      const avgScore = roastedCommits.reduce((s, c) => s + c.score, 0) / roastedCommits.length;
      let blazeFinal: BlazeState;
      if (avgScore >= 8)      blazeFinal = 'nuclear';
      else if (avgScore >= 5) blazeFinal = 'spicy';
      else if (avgScore >= 3) blazeFinal = 'mild';
      else                    blazeFinal = 'success';

      const session: RoastSession = {
        id: slugify(repo),
        repo,
        fetchedAt: new Date().toISOString(),
        totalCommits: data.total_fetched,
        averageScore: Math.round(avgScore * 10) / 10,
        commits: roastedCommits,
        blazeState: blazeFinal,
      };

      // Persist to localStorage for the share page
      try {
        localStorage.setItem(`gv:${session.id}`, JSON.stringify(session));
      } catch {
        // localStorage unavailable — silent fail
      }

      dispatch({ type: 'ROAST_SUCCESS', session });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      dispatch({ type: 'FETCH_ERROR', error: 'Something went wrong. Check the repo URL and try again.' });
    }
  }, [dispatch]);

  const isLoading = ['fetching', 'scoring', 'roasting'].includes(state.status);
  const hasError  = state.status === 'error';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Nav ── */}
      <nav className="gv-nav">
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.5rem', letterSpacing: '0.04em' }}>
          GitVerdict
        </span>
        <div className="gv-nav-links">
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 1.5rem 6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', maxWidth: '680px', width: '100%' }}
        >
          {/* Headline */}
          <h1 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 'clamp(3.2rem, 9vw, 6.5rem)',
            lineHeight: 0.92,
            color: 'var(--ink-primary)',
            marginBottom: '0.4em',
            letterSpacing: '0.02em',
          }}>
            Your commits,<br />
            <span style={{ color: 'var(--fire-orange)' }}>judged.</span>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.1rem',
            color: 'var(--ink-secondary)',
            marginBottom: '3rem',
            maxWidth: '480px',
            margin: '0 auto 3rem',
            lineHeight: 1.6,
          }}>
            Paste a GitHub repo. We score your worst commits and roast them with zero mercy.
          </p>

          {/* BLAZE + speech bubble */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div style={{ position: 'relative' }}>
              <BlazeSpeechBubble state={blazeState} visible={true} />
            </div>
            <motion.div
              key={blazeState}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Blaze state={blazeState} size={160} />
            </motion.div>
          </div>

          {/* Input */}
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <RepoInput onSubmit={handleSubmit} disabled={isLoading} />
          </div>

          {/* Error */}
          <AnimatePresence>
            {hasError && state.error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '1rem',
                  color: 'var(--fire-red)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.9rem',
                }}
              >
                {state.error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loader overlay */}
        <RoastLoader
          visible={isLoading}
          commitCount={state.commitCount}
          status={state.status}
        />
      </main>

      {/* ── Footer ── */}
      <footer className="gv-footer">
        <span>GitVerdict — we judge so your PR reviewer doesn't have to.</span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
          <a href="https://github.com/AHILL-0121" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Dev: @AHILL-0121</a>
          <span style={{ color: 'var(--border)' }}>|</span>
          <a href="https://sa-portfolio-psi.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Portfolio</a>
        </div>
      </footer>
    </div>
  );
}
