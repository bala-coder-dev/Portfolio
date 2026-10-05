# Balamurugan K — Developer Portfolio

A personal portfolio for  showcasing software engineering projects, experience, skills, and achievements. The site combines an editorial-tech visual style with interactive motion, a terminal-inspired interface, and server-backed portfolio chat and contact features.

**Live site:** [bala-portfolio-jade.vercel.app](https://bala-portfolio-jade.vercel.app)

**Source:** [github.com/bala-coder-dev/Portfolio](https://github.com/bala-coder-dev/Portfolio)

## Highlights

- **Cinematic intro:** 3D BM monogram with animated orbit paths, technology nodes, and matrix-style digital rain.
- **Interactive portfolio background:** Canvas-based neural network particles connect to nearby nodes and the pointer.
- **Project showcase:** Filterable project cards for AI, developer tooling, and civic technology work.
- **Terminal-inspired UI:** Interactive terminal mode, animated welcome text, and portfolio assistant.
- **Portfolio assistant:** Server-side Next.js route connects to OpenRouter, with model fallback and curated portfolio responses.
- **Contact form:** Validates visitor messages and sends notifications through Resend.
- **Responsive layout:** Adapts the navigation, hero, cards, and content sections across screen sizes.
- **Accessibility considerations:** Reduced-motion preferences are respected by the animated UI.

## Featured projects

| Project | Description |
| --- | --- |
| [SME Nexus AI](https://github.com/bala-coder-dev/SME-Nexus-AI) | Multi-agent business intelligence platform with seven specialized executive agents. |
| [PR Review Copilot](https://github.com/bala-coder-dev/pr-review-copilot) | AI-assisted pull request review pipeline for structured engineering feedback. |
| TruthLens | Multimodal forensic media inspection concept for synthetic media and deepfake analysis. |
| CivicPulse | Location-aware civic intelligence platform for prioritizing community reports. |

## Tech stack

- **Framework:** Next.js 16 App Router, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Visuals:** HTML Canvas API, CSS 3D transforms
- **Assistant API:** OpenRouter, accessed through a server-side Route Handler
- **Contact API:** Resend, accessed through a server-side Route Handler
- **Analytics:** Vercel Analytics in production

## Run locally

### Requirements

- Node.js 20.9 or later
- pnpm 12 (the package manager declared by this repository)

### Install and start

```bash
git clone https://github.com/bala-coder-dev/Portfolio.git
cd Portfolio
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To create and run a production build locally:

```bash
pnpm build
pnpm start
```

## Environment variables

Create a `.env.local` file in the project root for server-side integrations:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
RESEND_API_KEY=your_resend_api_key
CONTACT_FROM_EMAIL=Portfolio Contact <contact@your-verified-domain.com>
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

Keep real credentials private. Do not commit `.env.local` or expose API keys through client-side code.

### Portfolio assistant

`OPENROUTER_API_KEY` is required by `app/api/chat/route.ts`. The route calls OpenRouter from the server and tries its configured models in sequence. `NEXT_PUBLIC_SITE_URL` is optional and is sent as the OpenRouter HTTP referer; it defaults to `http://localhost:3000`.

### Contact form

`RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are required by `app/api/contact/route.ts`. The route sends notifications to the portfolio inbox, `balamurugan008jk@gmail.com`, and includes the visitor's email in the notification subject and body.

For production delivery, verify a domain with Resend and use a sender address on that domain. Resend's `onboarding@resend.dev` testing sender is restricted to the address verified on your Resend account, so it is suitable only for testing within that limitation. The contact API requires a server-capable host; static-only hosting cannot run it.

## Deployment

The app can be deployed to [Vercel](https://vercel.com) by importing the GitHub repository. Add the required server environment variables in the project settings before testing the assistant and contact form. Redeploy after changing deployment environment variables.

## Project structure

```text
app/
  api/
    chat/route.ts       # Portfolio assistant endpoint
    contact/route.ts    # Contact form email endpoint
  globals.css           # Global styles and portfolio animations
  page.tsx              # Main portfolio page
components/
  portfolio-intro.tsx   # Intro animation and matrix rain
  portfolio-effects.tsx # Canvas, terminal, and interactive effects
  contact-section.tsx   # Contact form and contact links
```

## License

This repository contains a personal portfolio. Contact the author before reusing its branding, assets, or personal content.
