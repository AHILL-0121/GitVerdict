# GitVerdict 🔥

> Your commits, judged.

A brutally honest AI-powered tool that scores your GitHub commit history and roasts your worst commits with zero mercy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AHILL-0121/GitVerdict)

## ✨ Features

- 🔍 **GitHub Integration** — Fetch commits from any public repository
- 📊 **Smart Scoring** — Algorithm analyzes commit quality (message length, clarity, patterns)
- 🤖 **AI Roasting** — Groq AI (Llama 3.3 70B) generates savage but constructive feedback
- 🎭 **BLAZE Mascot** — Animated character with 10+ emotional states that react to your code crimes
- 🎨 **Beautiful UI** — Retro-modern design with custom cursor and grain texture
- 🔗 **Share Results** — Save and share roast sessions via unique URLs (localStorage-based)
- ⚡ **Edge Runtime** — Fast global API responses via Vercel Edge Functions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Groq API key ([Get one free here](https://console.groq.com))
- GitHub token (optional, for higher API rate limits)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AHILL-0121/GitVerdict.git
cd GitVerdict/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
```env
GROQ_API_KEY=your_groq_api_key_here
GITHUB_TOKEN=your_github_token_here  # Optional, recommended
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open in browser**
   
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4 + CSS Modules
- **Animation**: Framer Motion 11.2
- **State**: React Context + useReducer

### Backend / APIs
- **Runtime**: Vercel Edge Functions
- **AI Model**: Llama 3.3 70B (via Groq Cloud API)
- **Data Source**: GitHub REST API
- **Deployment**: Vercel

### Key Libraries
- `framer-motion` — Smooth page/component animations
- `next` 14.2 — React framework with App Router
- `tailwindcss` — Utility-first CSS
- `typescript` — Type safety

## 📁 Project Structure

```
GitVerdict/
├── .github/
│   └── copilot-instructions.md
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── commits/route.ts    # GitHub API proxy
│   │   │   └── roast/route.ts      # Groq AI roasting endpoint
│   │   ├── r/[slug]/page.tsx       # Share page
│   │   ├── results/page.tsx        # Results display
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── Blaze/                  # Mascot with 10+ states
│   │   ├── Cursor/                 # Custom cursor
│   │   ├── Input/                  # Repo input
│   │   ├── Loader/                 # Loading states
│   │   ├── Results/                # Results components
│   │   └── Share/                  # Share buttons
│   ├── hooks/
│   │   ├── useRoastStore.tsx       # Global state management
│   │   ├── useMousePosition.ts     # Cursor tracking
│   │   └── useTypewriter.ts        # Text animation
│   ├── lib/
│   │   └── scorer.ts               # Commit scoring algorithm
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   ├── public/
│   │   ├── favicon.svg             # BLAZE icon
│   │   ├── robots.txt              # SEO
│   │   ├── blaze-mascot.svg        # Reference design
│   │   └── blaze-states-showcase.html  # State demos
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## 🎯 How It Works

1. **Fetch** — Enter a GitHub repo URL → API fetches recent commits
2. **Score** — Algorithm analyzes each commit for quality issues (1-10 scale)
3. **Roast** — Top 10 worst commits sent to Groq AI for roasting
4. **Display** — Results shown with shame scores and BLAZE reactions
5. **Share** — Sessions saved locally, shareable via unique URLs

## 📊 Scoring Algorithm

Commits are scored 1-10 based on:

### Penalties ❌
- Message too short (≤3 chars: +5, ≤10 chars: +2)
- Vague patterns ("fix", "wip", "asdf", "stuff": +2-4)
- Excessive punctuation ("!!!", "???": +1)
- Late-night commits (0-5am: +2, 11pm: +1)
- Profanity or desperation signals (+1-2)

### Credits ✅
- Conventional commits (feat:, fix:, docs:: -3)
- Optimal length (20-72 chars: -1)

Formula: `Math.max(1, Math.min(10, baseScore))`

## 🎭 BLAZE States

The mascot has 10+ emotional states:

| State | When | Expression |
|-------|------|------------|
| 🔥 **Idle** | Waiting for input | Calm, arms crossed |
| ⏳ **Loading** | Fetching commits | Wide eyes, waving |
| 🎯 **Roasting** | AI cooking roasts | Focused, pointing |
| ✅ **Success** | Clean commits! | Happy, thumbs up |
| 😊 **Mild** | Score 1-3 | Smirk, one brow raised |
| 🌶️ **Spicy** | Score 4-6 | Concerned, steam |
| ☢️ **Nuclear** | Score 7-10 | Mega flame, rage |
| 😴 **Done** | Finished judging | Exhausted, tear |
| ❌ **Error** | Something broke | Angry, X eyes |
| 🔍 **Not Found** | Repo missing | Confused, shrugging |

## 🌍 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | — | Groq Cloud API key for AI roasting |
| `GITHUB_TOKEN` | ❌ No | — | GitHub PAT (60/hr → 5000/hr rate limit) |

### Getting API Keys

**Groq API Key:**
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up (free tier available)
3. Create an API key
4. Add to `.env.local`

**GitHub Token (Optional):**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. No scopes needed (public repo access only)
4. Add to `.env.local`

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Click the Deploy button** at the top of this README, or:

```bash
npm install -g vercel
cd frontend
vercel
```

2. **Add environment variables** in Vercel dashboard:
   - `GROQ_API_KEY`
   - `GITHUB_TOKEN` (optional)

3. **Done!** Your app is live.

### Other Platforms

The app can deploy anywhere Next.js 14 is supported:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Railway
- Render

Ensure Edge Runtime is supported for optimal API performance.

## 📸 Screenshots

### Landing Page
Clean, retro-modern design with BLAZE mascot and repo input.

### Results Page
Hall of Shame with commit cards, scores, and AI roasts.

### BLAZE Reactions
Mascot changes expressions based on your commit quality!

## 📦 Bundle Size

Production build metrics:

| Route | Size | First Load JS |
|-------|------|---------------|
| Landing (`/`) | 5.06 KB | 135 KB |
| Results (`/results`) | 1.65 KB | 135 KB |
| Share (`/r/[slug]`) | 1.63 KB | 135 KB |
| Shared chunks | — | 87 KB |

## 🧪 Development

### Scripts

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

### Project Guidelines

- **TypeScript strict mode** enabled
- **ESLint + Prettier** for code quality
- **Conventional commits** encouraged
- **Component-based** architecture
- **Mobile-first** responsive design

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- **localStorage sharing** — Sessions only work same-browser (not cross-device)
- **Rate limiting** — In-memory cache resets per Edge instance (consider Upstash Redis for production)
- **GitHub API** — 60 req/hr without token, 5000 req/hr with token

## 📝 License

MIT License - feel free to roast your own projects!

## 👨‍💻 Credits

**Developer**: [@AHILL-0121](https://github.com/AHILL-0121)  
**Portfolio**: [sa-portfolio-psi.vercel.app](https://sa-portfolio-psi.vercel.app/)  
**AI Model**: Llama 3.3 70B via [Groq Cloud](https://groq.com)

---

**GitVerdict** — We judge so your PR reviewer doesn't have to. 🔥

