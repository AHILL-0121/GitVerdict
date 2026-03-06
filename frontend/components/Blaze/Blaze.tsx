'use client';

import { type BlazeState } from '@/types';
import styles from './blaze.module.css';
import clsx from 'clsx';

interface BlazeProps {
  state?: BlazeState;
  size?: number;
  className?: string;
}

// ─── Eyebrow paths per state ────────────────────────────────────────────────
const EB_L: Record<BlazeState, string> = {
  idle:           'M 63 108 Q 70 105 77 107',
  loading:        'M 60 104 Q 70 100 77 102',
  success:        'M 64 107 Q 70 105 77 106',
  error:          'M 62 108 Q 70 107 77 108',
  'not-found':    'M 62 112 Q 70 110 77 111',
  nuclear:        'M 59 103 Q 70  99 77 101',
  'rate-limited': 'M 64 111 Q 70 110 76 111',
  empty:          'M 60 105 Q 70 101 77 103',
  mild:           'M 63 104 Q 70 101 77 103',
  done:           'M 64 110 Q 70 109 76 110',
  roasting:       'M 63 108 Q 70 105 77 107',
  spicy:          'M 65 109 Q 70 107 75 108',
};
const EB_R: Record<BlazeState, string> = {
  idle:           'M 83 107 Q 90 105 97 108',
  loading:        'M 83 102 Q 90 100 100 104',
  success:        'M 83 106 Q 90 105 96 107',
  error:          'M 83 108 Q 90 107 98 108',
  'not-found':    'M 83 111 Q 90 110 98 112',
  nuclear:        'M 83 101 Q 90  99 101 103',
  'rate-limited': 'M 84 111 Q 90 110 96 111',
  empty:          'M 83 103 Q 90 101 100 105',
  mild:           'M 83 107 Q 90 105 97 108',
  done:           'M 84 110 Q 90 109 96 110',
  roasting:       'M 83 107 Q 90 105 97 108',
  spicy:          'M 85 108 Q 90 107 95 109',
};

// ─── Path mouths (nuclear/empty get open SVG shapes instead) ────────────────
const MOUTH_PATH: Partial<Record<BlazeState, string>> = {
  idle:           'M 68 129 Q 80 136 92 129',
  loading:        'M 67 131 Q 80 136 93 131',
  success:        'M 64 128 Q 80 143 96 128',
  error:          'M 70 133 Q 80 128 90 133',
  'not-found':    'M 69 131 Q 80 136 91 131',
  'rate-limited': 'M 70 132 Q 80 131 90 132',
  mild:           'M 69 129 Q 78 134 88 130',
  done:           'M 70 133 Q 80 131 90 133',
  roasting:       'M 68 128 Q 80 138 92 128',
  spicy:          'M 70 131 Q 80 131 90 131',
};

// ─── Shared SVG defs ────────────────────────────────────────────────────────
function Defs() {
  return (
    <defs>
      <radialGradient id="flameCore" cx="50%" cy="80%" r="50%">
        <stop offset="0%"   stopColor="#FFF176" />
        <stop offset="40%"  stopColor="#F5C842" />
        <stop offset="100%" stopColor="#E8341A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="flameOuter" cx="50%" cy="70%" r="60%">
        <stop offset="0%"   stopColor="#F57C2B" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C94A1E" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="headGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%"   stopColor="#F5C842" />
        <stop offset="60%"  stopColor="#E8A020" />
        <stop offset="100%" stopColor="#C97A10" />
      </radialGradient>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#C4A265" />
        <stop offset="40%"  stopColor="#E8D5A3" />
        <stop offset="100%" stopColor="#B8925A" />
      </linearGradient>
      <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="bodyGlow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#E8A020" floodOpacity="0.25" />
      </filter>
    </defs>
  );
}

// ─── Eyes renderer ──────────────────────────────────────────────────────────
function Eyes({ state }: { state: BlazeState }) {
  if (state === 'success') {
    return (
      <>
        <path d="M 63 117 Q 70 111 77 117" stroke="#3D2200" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M 83 117 Q 90 111 97 117" stroke="#3D2200" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <ellipse cx="68" cy="121" rx="4" ry="2" fill="#F5C842" opacity="0.2" />
        <ellipse cx="92" cy="121" rx="4" ry="2" fill="#F5C842" opacity="0.2" />
      </>
    );
  }
  if (state === 'error') {
    return (
      <>
        <ellipse cx="70" cy="117" rx="6.5" ry="7" fill="white" opacity="0.95" />
        <ellipse cx="90" cy="117" rx="6.5" ry="7" fill="white" opacity="0.95" />
        <line x1="65" y1="112" x2="75" y2="122" stroke="#E8341A" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="75" y1="112" x2="65" y2="122" stroke="#E8341A" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="85" y1="112" x2="95" y2="122" stroke="#E8341A" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="95" y1="112" x2="85" y2="122" stroke="#E8341A" strokeWidth="2.8" strokeLinecap="round" />
      </>
    );
  }
  if (state === 'not-found') {
    return (
      <>
        <ellipse cx="70" cy="117" rx="6.5" ry="7" fill="white" opacity="0.95" />
        <ellipse cx="90" cy="117" rx="6.5" ry="7" fill="white" opacity="0.95" />
        <circle cx="70" cy="117" r="5"   fill="none" stroke="#3D2200" strokeWidth="1.4" />
        <circle cx="70" cy="117" r="2.8" fill="none" stroke="#3D2200" strokeWidth="1.2" />
        <circle cx="70" cy="117" r="0.9" fill="#3D2200" />
        <circle cx="90" cy="117" r="5"   fill="none" stroke="#3D2200" strokeWidth="1.4" />
        <circle cx="90" cy="117" r="2.8" fill="none" stroke="#3D2200" strokeWidth="1.2" />
        <circle cx="90" cy="117" r="0.9" fill="#3D2200" />
      </>
    );
  }
  if (state === 'rate-limited' || state === 'done') {
    return (
      <>
        <ellipse cx="70" cy="119" rx="6.5" ry="4.2" fill="white" opacity="0.9" />
        <ellipse cx="90" cy="119" rx="6.5" ry="4.2" fill="white" opacity="0.9" />
        <circle  cx="70" cy="120" r="3"   fill="#3D2200" />
        <circle  cx="90" cy="120" r="3"   fill="#3D2200" />
        <circle  cx="71" cy="119" r="1.5" fill="#1A0A00" />
        <circle  cx="91" cy="119" r="1.5" fill="#1A0A00" />
        <path d="M 63 118 Q 70 114 77 118" stroke="#5C3A00" strokeWidth="2"   fill="none" strokeLinecap="round" />
        <path d="M 83 118 Q 90 114 97 118" stroke="#5C3A00" strokeWidth="2"   fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (state === 'loading' || state === 'nuclear' || state === 'empty') {
    return (
      <>
        <ellipse className={styles['eye-blink']} cx="70" cy="116" rx="7.5" ry="8.5" fill="white" opacity="0.95" />
        <ellipse className={styles['eye-blink']} cx="90" cy="116" rx="7.5" ry="8.5" fill="white" opacity="0.95" />
        <circle  cx="70" cy="116" r="4.8" fill="#3D2200" />
        <circle  cx="90" cy="116" r="4.8" fill="#3D2200" />
        <circle  className={styles['pupil-left']} cx="71" cy="116" r="2.8" fill="#1A0A00" />
        <circle  cx="91" cy="116" r="2.8" fill="#1A0A00" />
        <circle  cx="72" cy="113" r="1.5" fill="white" opacity="0.9" />
        <circle  cx="92" cy="113" r="1.5" fill="white" opacity="0.9" />
      </>
    );
  }
  return (
    <>
      <ellipse className={styles['eye-blink']} cx="70" cy="117" rx="6.5" ry="7"  fill="white" opacity="0.95" />
      <ellipse className={styles['eye-blink']} cx="90" cy="117" rx="6.5" ry="7"  fill="white" opacity="0.95" />
      <circle  cx="70" cy="118" r="4.2" fill="#3D2200" />
      <circle  cx="90" cy="118" r="4.2" fill="#3D2200" />
      <circle  className={styles['pupil-left']} cx="71" cy="118" r="2.5" fill="#1A0A00" />
      <circle  cx="91" cy="118" r="2.5" fill="#1A0A00" />
      <circle  cx="72" cy="116" r="1.2" fill="white" opacity="0.9" />
      <circle  cx="92" cy="116" r="1.2" fill="white" opacity="0.9" />
    </>
  );
}

// ─── Mouth renderer ─────────────────────────────────────────────────────────
function Mouth({ state }: { state: BlazeState }) {
  if (state === 'nuclear') {
    return (
      <>
        <ellipse cx="80" cy="132" rx="10"  ry="7.5" fill="#3D2200" />
        <ellipse cx="80" cy="129" rx="8"   ry="4"   fill="white"   opacity="0.55" />
        <ellipse cx="80" cy="136" rx="7"   ry="3"   fill="#8B2A00" opacity="0.4" />
      </>
    );
  }
  if (state === 'empty') {
    return (
      <>
        <ellipse cx="80" cy="131" rx="7.5" ry="6" fill="#3D2200" />
        <ellipse cx="80" cy="129" rx="5.5" ry="3" fill="white"   opacity="0.4" />
      </>
    );
  }
  const path = MOUTH_PATH[state] ?? MOUTH_PATH.idle!;
  return (
    <>
      <path d={path} stroke="#5C3A00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {state === 'success' && (
        <path d="M 68 131 Q 80 136 92 131" stroke="#C97A10" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
      )}
    </>
  );
}

// ─── Arms renderer ──────────────────────────────────────────────────────────
function Arms({ state }: { state: BlazeState }) {
  const S = 'url(#bodyGrad)';
  switch (state) {
    case 'loading':
      return (
        <>
          <g className={styles['arm-l']}>
            <line x1="72" y1="152" x2="40" y2="132" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="40" y1="132" x2="28" y2="112" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="26" cy="109" r="5" fill="#E8D5A3" />
          </g>
          <g className={styles['arm-r']}>
            <line x1="88" y1="152" x2="120" y2="132" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="120" y1="132" x2="132" y2="112" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="134" cy="109" r="5" fill="#E8D5A3" />
          </g>
        </>
      );
    case 'success':
      return (
        <>
          <g className={styles['arm-l']}>
            <line x1="72" y1="152" x2="38" y2="172" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="38" y1="172" x2="30" y2="196" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="28" cy="199" r="5" fill="#E8D5A3" />
          </g>
          {/* Thumbs up right arm */}
          <line x1="88" y1="152" x2="116" y2="136" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="116" y1="136" x2="122" y2="114" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="122" cy="111" rx="5.5" ry="5" fill="#E8D5A3" />
          <rect x="119.5" y="94" width="5.5" height="18" rx="2.8" fill="#E8D5A3" />
          <ellipse cx="122" cy="95" rx="2" ry="1.5" fill="#C4A265" opacity="0.5" />
        </>
      );
    case 'error':
      return (
        <>
          <line x1="72"  y1="152" x2="50"  y2="163" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="50"  y1="163" x2="44"  y2="184" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <rect x="37"   y="181" width="14" height="11" rx="4" fill="#C4A265" />
          <line x1="88"  y1="152" x2="110" y2="163" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="110" y1="163" x2="116" y2="184" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <rect x="113"  y="181" width="14" height="11" rx="4" fill="#C4A265" />
        </>
      );
    case 'not-found':
      return (
        <>
          <line x1="72" y1="152" x2="44"  y2="132" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="44" y1="132" x2="28"  y2="120" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <circle cx="26" cy="118" r="5" fill="#E8D5A3" />
          <line x1="88"  y1="152" x2="116" y2="132" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="116" y1="132" x2="132" y2="120" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <circle cx="134" cy="118" r="5" fill="#E8D5A3" />
        </>
      );
    case 'nuclear':
    case 'roasting':
      return (
        <>
          <g className={styles['arm-l']}>
            <line x1="72" y1="152" x2="38" y2="172" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="38" y1="172" x2="30" y2="196" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="28" cy="199" r="5" fill="#E8D5A3" />
          </g>
          <line x1="88"  y1="152" x2="118" y2="138" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="118" y1="138" x2="136" y2="124" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <circle cx="137" cy="122" r="4.5" fill="#E8D5A3" />
          <line x1="139" y1="119" x2="145" y2="112" stroke="#E8D5A3" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="146" cy="110" r="2.5" fill="#E8D5A3" />
        </>
      );
    case 'rate-limited':
      return (
        <>
          <g className={styles['arm-l']}>
            <line x1="72"  y1="152" x2="40"  y2="192" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="40"  y1="192" x2="34"  y2="216" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="32" cy="219" r="5" fill="#E8D5A3" />
          </g>
          <g className={styles['arm-r']}>
            <line x1="88"  y1="152" x2="120" y2="192" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="120" y1="192" x2="126" y2="216" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="128" cy="219" r="5" fill="#E8D5A3" />
          </g>
        </>
      );
    case 'empty':
      return (
        <>
          <line x1="72" y1="152" x2="58" y2="136" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="58" y1="136" x2="55" y2="120" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <circle cx="54" cy="118" r="5" fill="#E8D5A3" />
          <line x1="88"  y1="152" x2="102" y2="136" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="102" y1="136" x2="105" y2="120" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <circle cx="106" cy="118" r="5" fill="#E8D5A3" />
        </>
      );
    case 'mild':
      return (
        <>
          <line x1="72" y1="152" x2="50" y2="163" stroke={S} strokeWidth="7" strokeLinecap="round" />
          <line x1="50" y1="163" x2="44" y2="184" stroke={S} strokeWidth="6" strokeLinecap="round" />
          <circle cx="42" cy="187" r="5" fill="#E8D5A3" />
          <g className={styles['arm-r']}>
            <line x1="88"  y1="152" x2="122" y2="172" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="122" y1="172" x2="130" y2="196" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="132" cy="199" r="5" fill="#E8D5A3" />
          </g>
        </>
      );
    case 'done':
      return (
        <>
          <g className={styles['arm-l']}>
            <line x1="72" y1="152" x2="40" y2="178" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="40" y1="178" x2="33" y2="200" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="31" cy="203" r="5" fill="#E8D5A3" />
          </g>
          <g className={styles['arm-r']}>
            <line x1="88"  y1="152" x2="120" y2="178" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="120" y1="178" x2="127" y2="200" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="129" cy="203" r="5" fill="#E8D5A3" />
          </g>
        </>
      );
    default:
      return (
        <>
          <g className={styles['arm-l']}>
            <line x1="72" y1="152" x2="38" y2="172" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="38" y1="172" x2="30" y2="196" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="28" cy="199" r="5" fill="#E8D5A3" />
          </g>
          <g className={styles['arm-r']}>
            <line x1="88"  y1="152" x2="122" y2="172" stroke={S} strokeWidth="7" strokeLinecap="round" />
            <line x1="122" y1="172" x2="130" y2="196" stroke={S} strokeWidth="6" strokeLinecap="round" />
            <circle cx="132" cy="199" r="5" fill="#E8D5A3" />
          </g>
        </>
      );
  }
}

// ─── Flame renderer ─────────────────────────────────────────────────────────
function Flame({ state }: { state: BlazeState }) {
  const isDying   = state === 'done' || state === 'rate-limited';
  const isNuclear = state === 'nuclear';
  const scale     = isNuclear ? 1.65 : isDying ? 0.38 : 1;
  const opacity   = isDying ? 0.5 : 1;

  return (
    <>
      {isNuclear && (
        <>
          <g className={styles['side-flame-l']} filter="url(#flameGlow)">
            <path
              d="M 52 110 C 36 104 32 92 38 82 C 42 74 50 70 52 64 C 55 72 58 76 60 74 C 58 84 56 94 52 110 Z"
              fill="url(#flameOuter)" opacity="0.7"
            />
          </g>
          <g className={styles['side-flame-r']} filter="url(#flameGlow)">
            <path
              d="M 108 110 C 124 104 128 92 122 82 C 118 74 110 70 108 64 C 105 72 102 76 100 74 C 102 84 104 94 108 110 Z"
              fill="url(#flameOuter)" opacity="0.7"
            />
          </g>
          <g className={styles['nuke-extra']} filter="url(#flameGlow)" style={{ transformOrigin: '80px 72px' }}>
            <path
              d="M 80 80 C 50 70 34 46 42 20 C 48 4 60 -4 64 -12 C 67 4 72 10 80 6 C 88 10 93 4 96 -12 C 100 -4 112 8 118 24 C 126 50 110 70 80 80 Z"
              fill="url(#flameOuter)" opacity="0.45"
            />
          </g>
        </>
      )}
      <g style={{ transform: `scale(${scale})`, transformOrigin: '80px 72px', opacity }}>
        <g className={styles['flame-outer']} filter="url(#flameGlow)">
          <path
            d="M 80 76 C 58 68,46 50,52 30 C 55 18,64 10,68 2 C 70 14,74 20,80 16 C 86 10,88 2,92 2 C 98 14,106 24,108 36 C 112 55,100 68,80 76 Z"
            fill="url(#flameOuter)" opacity="0.85"
          />
        </g>
        <g className={styles['flame-inner']} filter="url(#flameGlow)">
          <path
            d="M 80 74 C 63 67,54 52,59 36 C 62 24,69 16,72 8 C 75 18,78 23,80 20 C 82 23,85 18,88 8 C 92 18,98 28,101 40 C 104 56,96 67,80 74 Z"
            fill="url(#flameCore)" opacity="0.9"
          />
        </g>
        <g className={styles['flame-tip']}>
          <path
            d="M 80 70 C 70 62,65 50,68 38 C 71 28,76 22,80 18 C 84 22,89 30,90 40 C 92 52,88 62,80 70 Z"
            fill="#FFF9C4" opacity="0.95"
          />
        </g>
        {!isDying && <ellipse cx="80" cy="52" rx="7" ry="10" fill="white" opacity="0.6" />}
      </g>
    </>
  );
}

// ─── State decorations ──────────────────────────────────────────────────────
function Decorations({ state }: { state: BlazeState }) {
  switch (state) {
    case 'loading':
      return (
        <g aria-hidden="true">
          <path d="M 52 96 Q 44 88 48 78"   className={styles.steam}          fill="none" stroke="#B0A090" strokeWidth="2"   strokeLinecap="round" opacity="0.55" />
          <path d="M 108 96 Q 116 88 112 78" className={styles['steam-2']}     fill="none" stroke="#B0A090" strokeWidth="2"   strokeLinecap="round" opacity="0.55" />
          <path d="M 60 100 Q 52 92 56 82"   className={styles['steam-3']}     fill="none" stroke="#B0A090" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"  />
        </g>
      );
    case 'success':
      return (
        <g aria-hidden="true">
          <circle cx="110" cy="92" r="13"   fill="#3B7A57" />
          <circle className={styles['badge-pulse']} cx="110" cy="92" r="13" fill="#3B7A57" opacity="0.3" />
          <polyline points="103,92 108,98 118,83" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <g className={styles['star-a']}>
            <line x1="42" y1="88" x2="42"  y2="74"  stroke="#F5C842" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="35" y1="81" x2="49"  y2="81"  stroke="#F5C842" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="37" y1="76" x2="47"  y2="86"  stroke="#F5C842" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="47" y1="76" x2="37"  y2="86"  stroke="#F5C842" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g className={styles['star-b']}>
            <line x1="118" y1="78" x2="118" y2="68" stroke="#F5C842" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="113" y1="73" x2="123" y2="73" stroke="#F5C842" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <g className={styles['star-c']}>
            <line x1="130" y1="102" x2="130" y2="94" stroke="#F5C842" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="126" y1="98"  x2="134" y2="98" stroke="#F5C842" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>
      );
    case 'error':
      return (
        <g aria-hidden="true">
          <circle cx="110" cy="92" r="13" fill="#E8341A" />
          <line x1="103" y1="85" x2="117" y2="99" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="117" y1="85" x2="103" y2="99" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'not-found':
      return (
        <g aria-hidden="true">
          <text className={styles.question}          x="28"  y="108" fontFamily="sans-serif" fontSize="17" fontWeight="800" fill="#A0917C">?</text>
          <text className={styles['question-2']}     x="113" y="100" fontFamily="sans-serif" fontSize="14" fontWeight="800" fill="#A0917C">?</text>
          <text className={styles['question-3']}     x="35"  y="80"  fontFamily="sans-serif" fontSize="11" fontWeight="800" fill="#A0917C">?</text>
        </g>
      );
    case 'rate-limited':
      return (
        <g aria-hidden="true">
          <text className={styles.zzz}               x="96"  y="98"  fontFamily="sans-serif" fontSize="15" fontWeight="700" fill="#A0917C">Z</text>
          <text className={styles['zzz-2']}          x="105" y="86"  fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#A0917C">Z</text>
          <text className={styles['zzz-3']}          x="112" y="76"  fontFamily="sans-serif" fontSize="9"  fontWeight="700" fill="#A0917C">Z</text>
        </g>
      );
    case 'empty':
      return (
        <g aria-hidden="true">
          <g className={styles.orbiter}>
            <circle cx="106" cy="155" r="12"  fill="none" stroke="#F57C2B" strokeWidth="2.5" />
            <circle cx="106" cy="155" r="5.5" fill="none" stroke="#F57C2B" strokeWidth="2"   />
            <line x1="114" y1="163" x2="122" y2="172" stroke="#F57C2B" strokeWidth="3" strokeLinecap="round" />
          </g>
          <rect x="57" y="260" width="46" height="30" rx="4" fill="none" stroke="#DDD3C3" strokeWidth="1.5" />
          <path d="M 57 270 L 80 258 L 103 270" fill="none" stroke="#DDD3C3" strokeWidth="1.5" />
        </g>
      );
    case 'done':
      return (
        <g aria-hidden="true">
          <path className={styles.tear} d="M 67 128 Q 64 134 67 140 Q 70 134 67 128 Z" fill="#A0C4E8" opacity="0.75" />
        </g>
      );
    default:
      return null;
  }
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function Blaze({ state = 'idle', size = 160, className }: BlazeProps) {
  const stateClass = clsx({
    [styles['state-loading']]:      state === 'loading',
    [styles['state-success']]:      state === 'success',
    [styles['state-error']]:        state === 'error',
    [styles['state-not-found']]:    state === 'not-found',
    [styles['state-nuclear']]:      state === 'nuclear',
    [styles['state-rate-limited']]: state === 'rate-limited',
    [styles['state-empty']]:        state === 'empty',
    [styles['state-mild']]:         state === 'mild',
    [styles['state-done']]:         state === 'done',
    [styles['state-roasting']]:     state === 'roasting',
  });

  const bodyStyle: React.CSSProperties =
    state === 'done' ? { transform: 'rotate(-6deg)', transformOrigin: '80px 170px' } : {};

  const showSparkles = !['rate-limited', 'done', 'error', 'not-found'].includes(state);
  const showSweat    = ['loading', 'spicy', 'nuclear', 'empty'].includes(state);

  return (
    <div className={clsx(styles['blaze-wrap'], stateClass, className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 160 280"
        width={size}
        height={size * 1.75}
        role="img"
        aria-label={`BLAZE mascot — ${state}`}
        style={{ filter: 'drop-shadow(0 12px 28px rgba(245,124,43,0.28))' }}
      >
        <Defs />

        {/* Ground shadow */}
        <ellipse cx="80" cy="276" rx="28" ry="5" fill="#1C1712" opacity="0.10" />

        {/* Decorations that live behind the body (empty state box) */}
        {state === 'empty' && <Decorations state={state} />}

        {/* Floating body group */}
        <g className={styles['body-group']} style={bodyStyle}>

          {/* Legs */}
          <line x1="80" y1="228" x2="62" y2="268" stroke="url(#bodyGrad)" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="58"  cy="270" rx="10" ry="5" fill="#C4A265" opacity="0.6" />
          <line x1="80" y1="228" x2="98" y2="268" stroke="url(#bodyGrad)" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="102" cy="270" rx="10" ry="5" fill="#C4A265" opacity="0.6" />

          {/* Body stick */}
          <line x1="80" y1="130" x2="80" y2="230" stroke="url(#bodyGrad)" strokeWidth="10" strokeLinecap="round" filter="url(#bodyGlow)" />
          <line x1="77" y1="150" x2="83" y2="152" stroke="#B8925A" strokeWidth="0.8" opacity="0.5" />
          <line x1="76" y1="168" x2="84" y2="165" stroke="#B8925A" strokeWidth="0.8" opacity="0.4" />
          <line x1="77" y1="188" x2="83" y2="190" stroke="#B8925A" strokeWidth="0.8" opacity="0.5" />
          <line x1="76" y1="208" x2="84" y2="206" stroke="#B8925A" strokeWidth="0.8" opacity="0.4" />

          {/* State-specific arms */}
          <Arms state={state} />

          {/* Match head */}
          <ellipse cx="80" cy="118" rx="30" ry="28" fill="#F5C842" opacity="0.15" filter="url(#softGlow)" />
          <ellipse cx="80" cy="118" rx="26" ry="24" fill="url(#headGrad)" filter="url(#bodyGlow)" />
          <ellipse cx="72" cy="110" rx="8"  ry="5"  fill="white" opacity="0.22" transform="rotate(-20,72,110)" />

          {/* Eyes */}
          <Eyes state={state} />

          {/* Eyebrows */}
          <path d={EB_L[state] ?? EB_L.idle} stroke="#5C3A00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d={EB_R[state] ?? EB_R.idle} stroke="#5C3A00" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Mouth */}
          <Mouth state={state} />

          {/* Blush */}
          <ellipse cx="63" cy="126" rx="6" ry="3.5" fill="#E8341A"
            opacity={state === 'error' ? 0.06 : state === 'done' ? 0.07 : 0.12} />
          <ellipse cx="97" cy="126" rx="6" ry="3.5" fill="#E8341A"
            opacity={state === 'error' ? 0.06 : state === 'done' ? 0.07 : 0.12} />

          {/* Sweat drop */}
          {showSweat && (
            <ellipse className={styles['sweat-drop']} cx="101" cy="110" rx="3" ry="4.5" fill="#A0C4E8" opacity="0.5" />
          )}

          {/* Flame */}
          <Flame state={state} />

          {/* Sparkles */}
          {showSparkles && (
            <>
              <g className={styles['sparkle-a']}>
                <line x1="112" y1="90" x2="112" y2="82" stroke="#F5C842" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="108" y1="90" x2="116" y2="90" stroke="#F5C842" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <g className={styles['sparkle-b']}>
                <line x1="46" y1="100" x2="46" y2="92" stroke="#F57C2B" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="42" y1="100" x2="50" y2="100" stroke="#F57C2B" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <g className={styles['sparkle-c']}>
                <line x1="118" y1="110" x2="118" y2="104" stroke="#F5C842" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="115" y1="110" x2="121" y2="110" stroke="#F5C842" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            </>
          )}
        </g>

        {/* State decorations that float outside/around the body */}
        {state !== 'empty' && <Decorations state={state} />}
      </svg>
    </div>
  );
}


