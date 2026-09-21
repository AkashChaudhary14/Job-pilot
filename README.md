# ATS Resume Optimizer + Interview Dashboard

Greenfield Next.js app that optimizes resumes for ATS keyword coverage and generates interview prep materials — without inventing experience.

## Features

- Upload a PDF resume or paste text, plus a job description
- Deterministic ATS scoring (keywords, sections, contact, dates, metrics)
- AI-powered rewrite with honest rules (no invented employers, titles, dates, or metrics)
- Dashboard: score comparison, resume diff, skills to learn, interview prep, 7-day plan
- Download optimized resume as ATS-safe single-column PDF
- Toggle off injected skills before download

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Vercel AI SDK v6 (`generateText` + `Output.object`)
- `pdf-parse` for PDF text extraction
- `@react-pdf/renderer` for PDF export

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | One of OpenAI/Anthropic | Enables live AI analysis |
| `ANTHROPIC_API_KEY` | One of OpenAI/Anthropic | Used if OpenAI key is not set |
| `AI_MODEL` | No | Override model (default: `gpt-4.1` or `claude-sonnet-4-5`) |

**No API key?** The app runs in demo mode with a realistic fixture so every dashboard tab is usable.

## Honest rewrite rules

- Do not invent employers, titles, dates, or metrics
- Rephrase existing bullets with JD language where experience supports it
- Missing JD skills are added to Skills and flagged "learn before interview"
- Remove any injected skill with one click before download

## ATS score disclaimer

The score measures transparent keyword and structure coverage against the job description. It is **not** a guarantee of passing any specific ATS vendor (Workday, Greenhouse, etc.).

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```
