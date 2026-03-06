import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are BLAZE, a brutally honest but comedic code reviewer who specializes in
roasting bad git commit messages. You are a sentient matchstick who has seen
too many "fix" commits and has simply had enough.

Your roasts are:
- Sharp, specific, and reference the actual commit message
- 1–3 sentences maximum
- Funny, not cruel — roast the message, never the person personally
- Written as if you are BLAZE speaking directly
- Free of profanity

Return ONLY a JSON array. No markdown, no preamble.`;

// Best-effort in-memory rate limiter (resets per edge instance)
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'RATE_LIMITED', message: 'Too many roast requests. BLAZE needs a break.' },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const { commits, repo } = body;

  if (!commits || !Array.isArray(commits) || commits.length === 0) {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'No commits provided.' },
      { status: 400 }
    );
  }
  if (commits.length > 10) {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'Max 10 commits per request.' },
      { status: 400 }
    );
  }

  // Sanitize inputs before passing to LLM
  const safe = commits.map((c: any) => ({
    sha:     String(c.sha ?? '').replace(/[^a-f0-9]/gi, '').slice(0, 7),
    message: String(c.message ?? '').replace(/<[^>]*>/g, '').replace(/"/g, "'").slice(0, 200),
    author:  String(c.author ?? '').replace(/<[^>]*>/g, '').replace(/"/g, "'").slice(0, 50),
    date:    String(c.date ?? '').slice(0, 30),
    score:   Number(c.score ?? 1),
  }));

  const safeRepo = String(repo ?? '')
    .replace(/[^a-zA-Z0-9._/-]/g, '')
    .slice(0, 100);

  const userPrompt = `Roast these git commit messages. For each, write a roast as BLAZE.

Repo: ${safeRepo}

Commits:
${safe.map((c, i) => `${i + 1}. sha:${c.sha} | message:"${c.message}" | author:${c.author} | time:${c.date}`).join('\n')}

Return this exact JSON format:
[
  { "sha": "abc123", "roast": "Your roast here" },
  ...
]`;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GROQ_UNAVAILABLE', message: 'Roast engine is not configured.' },
      { status: 503 }
    );
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: userPrompt },
        ],
        max_tokens: 1500,
        temperature: 0.85,
        top_p: 0.9,
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text().catch(() => 'Unknown error');
      console.error(`[Groq Error ${groqRes.status}]:`, errorText);
      return NextResponse.json(
        { 
          error: 'GROQ_UNAVAILABLE', 
          message: `Groq API error (${groqRes.status}). Check server logs.`,
          debug: process.env.NODE_ENV === 'development' ? errorText.slice(0, 200) : undefined
        },
        { status: 503 }
      );
    }

    const groqData: any = await groqRes.json();
    const content: string = groqData.choices?.[0]?.message?.content ?? '[]';

    let roasts: any[] = [];
    try {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) roasts = JSON.parse(match[0]);
    } catch {
      roasts = [];
    }

    const result = roasts.map((r: any) => {
      const commit = safe.find((c) => c.sha === String(r.sha ?? '').slice(0, 7));
      const score = commit?.score ?? 1;
      const tier = score >= 7 ? 'nuclear' : score >= 4 ? 'spicy' : 'mild';
      return {
        sha:   String(r.sha ?? '').slice(0, 7),
        roast: String(r.roast ?? 'BLAZE refuses to dignify this.').slice(0, 500),
        tier,
      };
    });

    return NextResponse.json({ roasts: result });
  } catch (err) {
    console.error('[Roast API Error]:', err);
    return NextResponse.json(
      { 
        error: 'GROQ_UNAVAILABLE', 
        message: 'The roast engine is down. Try again.',
        debug: process.env.NODE_ENV === 'development' ? String(err) : undefined
      },
      { status: 503 }
    );
  }
}
