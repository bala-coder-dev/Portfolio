# portfolio

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_8n8V9iHDCpnx1lGereLcyQFFH4O6)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Portfolio terminal

Open **Terminal Mode** from the navigation or press the backtick key to open the interactive shell. Supported commands are `help`, `clear`, `cat skills`, `cat projects`, `cat resume`, and `sudo get-resume`. Add the resume PDF at `public/resume.pdf` for the download command to serve a file.

## Feedback form

The feedback form sends messages through the Resend API to `balamurugan008jk@gmail.com`. Configure these server-only values in `.env.local` and in your deployment environment:

```env
RESEND_API_KEY=re_your_resend_api_key
CONTACT_FROM_EMAIL=Portfolio Contact <contact@your-verified-domain.com>
```

Resend's `onboarding@resend.dev` sender is limited to the email address verified on your Resend account. To deliver feedback to another inbox, verify a sending domain with Resend and use an address on that domain. Restart the development server after changing `.env.local`.

The contact API route needs a server-capable Next.js host. GitHub Pages only serves static files and cannot run `app/api/contact`; deploy the Next.js app to a host such as Vercel, or use a separate serverless backend.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
