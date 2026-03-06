'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Accepts: https://github.com/owner/repo  OR  owner/repo
const GITHUB_URL_REGEX  = /^https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/?$/;
const OWNER_REPO_REGEX  = /^([\w.-]+)\/([\w.-]+)$/;

function parseInput(raw: string): string | null {
  const trimmed = raw.trim();
  const urlMatch = trimmed.match(GITHUB_URL_REGEX);
  if (urlMatch) return `${urlMatch[1]}/${urlMatch[2]}`;
  const shortMatch = trimmed.match(OWNER_REPO_REGEX);
  if (shortMatch) return `${shortMatch[1]}/${shortMatch[2]}`;
  return null;
}

interface Props {
  onSubmit: (ownerRepo: string) => void;
  disabled?: boolean;
}

export default function RepoInput({ onSubmit, disabled = false }: Props) {
  const [value, setValue]   = useState('');
  const [error, setError]   = useState('');
  const [valid, setValid]   = useState(false);

  const validate = useCallback((val: string) => {
    if (!val) { setError(''); setValid(false); return; }
    if (parseInput(val) !== null) {
      setError(''); setValid(true);
    } else {
      setError('Enter a GitHub URL or owner/repo');
      setValid(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    validate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInput(value);
    if (!parsed) {
      setError('Enter a GitHub URL or owner/repo');
      return;
    }
    onSubmit(parsed);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 640 }} noValidate>
      <motion.div
        className="hero-input-wrap"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-elevated)',
          border: `2px solid ${error ? '#E8341A' : valid ? '#3B7A57' : 'var(--border)'}`,
          borderRadius: 12,
          height: 64,
          boxShadow: '0 2px 16px var(--shadow-warm)',
          transition: 'border-color .2s, box-shadow .2s',
          overflow: 'hidden',
        }}
      >
        <span style={{
          padding: '0 18px',
          fontSize: '1.1rem',
          color: 'var(--fire-orange)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          🔥
        </span>

        <input
          type="url"
          value={value}
          onChange={handleChange}
          placeholder="https://github.com/owner/repo  or  owner/repo"
          disabled={disabled}
          aria-label="GitHub repository URL"
          aria-describedby={error ? 'url-error' : undefined}
          style={{
            flex: 1,
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '0.95rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--ink-primary)',
            padding: '0 4px',
          }}
        />

        {/* Inline validation indicator */}
        <AnimatePresence mode="wait">
          {(valid || error) && (
            <motion.span
              key={valid ? 'ok' : 'err'}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                padding: '0 12px',
                fontSize: '1rem',
                color: valid ? '#3B7A57' : '#E8341A',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {valid ? '✓' : '✗'}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={disabled || !valid}
          whileHover={{ scale: disabled || !valid ? 1 : 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '0 28px',
            height: '100%',
            background: disabled || !valid ? 'var(--fire-ember)' : 'var(--fire-red)',
            color: 'white',
            border: 'none',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1rem',
            letterSpacing: '0.1em',
            cursor: disabled || !valid ? 'not-allowed' : 'none',
            opacity: disabled ? 0.7 : 1,
            transition: 'background .2s, opacity .2s',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-label="Roast this repository"
        >
          <span style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          ROAST IT →
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            id="url-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: 8,
              fontSize: '0.78rem',
              color: '#E8341A',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.02em',
            }}
          >
            ✗ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
