import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');

  // Validate repo format
  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'Invalid repo format. Use owner/repo.' },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GitVerdict/1.0',
    };

    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=50`,
      { headers, signal: controller.signal }
    );

    clearTimeout(timeout);

    if (res.status === 404) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Repo not found or is private.' },
        { status: 404 }
      );
    }
    if (res.status === 403 || res.status === 429) {
      return NextResponse.json(
        { error: 'RATE_LIMITED', message: 'GitHub API rate limit hit. Try again in an hour.' },
        { status: 429 }
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: 'GITHUB_ERROR', message: 'Failed to fetch commits from GitHub.' },
        { status: res.status }
      );
    }

    const data: any[] = await res.json();

    const commits = data.map((c) => ({
      sha: String(c.sha ?? '').slice(0, 7),
      message: String(c.commit?.message ?? '')
        .replace(/<[^>]*>/g, '')
        .split('\n')[0]
        .slice(0, 200),
      author: String(c.commit?.author?.name ?? 'Unknown')
        .replace(/<[^>]*>/g, '')
        .slice(0, 80),
      date: String(c.commit?.author?.date ?? new Date().toISOString()),
    }));

    return NextResponse.json({ repo, total_fetched: commits.length, commits });
  } catch (err: any) {
    clearTimeout(timeout);
    if (err?.name === 'AbortError') {
      return NextResponse.json(
        { error: 'TIMEOUT', message: 'Request timed out after 10 seconds.' },
        { status: 408 }
      );
    }
    return NextResponse.json(
      { error: 'FETCH_ERROR', message: 'Failed to fetch commits.' },
      { status: 500 }
    );
  }
}
