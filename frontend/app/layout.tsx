import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { RoastProvider } from '@/hooks/useRoastStore';
import './globals.css';

const CustomCursor = dynamic(() => import('@/components/Cursor/CustomCursor'), { ssr: false });

export const metadata: Metadata = {
  title: 'GitVerdict — Your Commits, Judged',
  description: 'Feed us a GitHub repo. We roast your commit history mercilessly.',
  keywords: ['git', 'github', 'commit', 'roast', 'code review', 'developer tools'],
  authors: [{ name: 'GitVerdict' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'GitVerdict — Your Commits, Judged',
    description: 'Feed us a GitHub repo. We roast your commit history mercilessly.',
    type: 'website',
    siteName: 'GitVerdict',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitVerdict — Your Commits, Judged',
    description: 'Your commits have been judged. See the verdict.',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <RoastProvider>
          <CustomCursor />
          {children}
        </RoastProvider>
      </body>
    </html>
  );
}
