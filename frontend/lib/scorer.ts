import type { Tier } from '@/types';

export function scoreCommit(message: string, date: string): number {
  let score = 0;
  const msg = message.trim().toLowerCase();
  const firstLine = msg.split('\n')[0];
  const hour = new Date(date).getHours();

  // Length penalties
  if (firstLine.length <= 3)  score += 5;  // "fix", "wip", "."
  if (firstLine.length <= 10) score += 2;  // "fixed bug"
  if (firstLine.length > 72)  score += 1;  // too long (minor)

  // Content crimes
  const vaguePhrases = [
    'fix', 'fixed', 'wip', 'update', 'changes',
    'stuff', 'things', 'test', 'testing', 'temp', 'tmp', 'asdf',
    'lol', 'oops', 'whoops', 'idk', 'misc', 'edit', 'edited',
  ];
  if (vaguePhrases.some(p => firstLine === p))                  score += 4;
  if (vaguePhrases.some(p => firstLine.startsWith(p + ' ')))   score += 2;

  // Desperation signals
  if (/!!!+/.test(msg))                                          score += 1;
  if (/please|finally|argh|why|ugh/.test(msg))                  score += 2;
  if (/fuck|shit|damn/.test(msg))                               score += 1;
  if (/\.\.\.+/.test(msg))                                      score += 1;

  // Time-of-day penalty
  if (hour >= 0 && hour <= 5) score += 2;  // 3am commit
  if (hour >= 23)             score += 1;  // midnight

  // Positive signals (reduce score)
  if (/^(feat|fix|docs|chore|refactor|test|style|perf|ci)\(/.test(msg)) score -= 3;
  if (firstLine.length >= 30 && firstLine.length <= 72)                   score -= 1;

  return Math.max(1, Math.min(10, score));
}

export function getTier(score: number): Tier {
  if (score <= 3) return 'mild';
  if (score <= 6) return 'spicy';
  return 'nuclear';
}

export function slugify(repo: string): string {
  const ts = Date.now().toString(36);
  return `${repo.replace('/', '-')}-${ts}`;
}
