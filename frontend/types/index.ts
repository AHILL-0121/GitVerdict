export type BlazeState =
  | 'idle'          // Hero section — arms relaxed, calm smirk, gentle float
  | 'loading'       // Fetch / API call — arms waving fast, wide eyes, steam
  | 'success'       // Roast complete — squint-happy, thumbs up, green ✓ badge
  | 'error'         // API error / bad URL — X eyes, fists on hips, red ✗ badge, shake
  | 'not-found'     // 404 page — spiral @ eyes, shrug arms, floating ? marks
  | 'nuclear'       // Score 9–10 — mega flame, side flames, yelling mouth, pointing
  | 'rate-limited'  // GitHub API cap — half-closed eyes, drooping arms, ZZZ float
  | 'empty'         // No commits — hands on cheeks, orbiting magnifier
  | 'mild'          // Score 1–3 — one brow raised, smirk, hand-on-hip
  | 'done'          // All roasts shown — head tilted, dying flame, single tear
  | 'roasting'      // (compat alias) — right arm pointing, roasting mode
  | 'spicy';        // (compat alias) — score 4–6, brows furrowed

export type Tier = 'mild' | 'spicy' | 'nuclear';

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  score: number;
  tier: Tier;
  roast?: string;
}

export interface RoastResult {
  sha: string;
  roast: string;
  tier: Tier;
}

export interface RoastSession {
  id: string;
  repo: string;
  fetchedAt: string;
  totalCommits: number;
  averageScore: number;
  commits: Commit[];
  blazeState: BlazeState;
}

export type AppStatus = 'idle' | 'fetching' | 'scoring' | 'roasting' | 'done' | 'error';
