import { NextResponse } from 'next/server'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: unknown
    }
  }>
  error?: {
    message?: string
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'The portfolio assistant is not configured yet.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('message' in body) ||
    typeof body.message !== 'string' ||
    !body.message.trim() ||
    body.message.length > 1000
  ) {
    return NextResponse.json({ error: 'Provide a message of up to 1000 characters.' }, { status: 400 })
  }

  let openRouterResponse: Response
  try {
    openRouterResponse = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
        'X-Title': "Bala's Portfolio Assistant",
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash:free',
        messages: [
          {
            role: 'system',
            content: `You are Balamurugan K's (Bala's) personal AI Portfolio Assistant. Answer questions professionally, confidently, and concisely in 2-3 sentences.

Use this verified context to answer any user queries accurately:
- Who is Bala: 3rd Year B.Tech IT student at SRMIST Ramapuram, Chennai (Graduation 2028). Highly skilled in full-stack engineering and AI system orchestration. Current CGPA is a stellar 9.70/10.00.
- Key Achievements: Selected as a Finalist at Agentic Arena 2026 (out of 880+ participants) with SME Nexus AI. Won Second Prize at Quantathon 2026. Ranked 3rd in the Mind & Machine AI Quiz (97.5% score).
- Project 1 (SME Nexus AI): Autonomous multi-agent enterprise platform with 7 specialized executive agents coordinated by an AI CEO orchestration engine. Built with React, TypeScript, Node.js, Express, Google Gemini, and Pinecone Vector DB.
- Project 2 (PR Review Copilot): AI-powered Pull Request review pipeline automating developer review loops. Uses secure GitHub webhooks (HMAC verification), tree-sitter code parsing, FastAPI backend, Groq API, Llama 3, and SQLite.
- Project 3 (TruthLens): Explainable multimodal forensic inspection platform for detecting deepfakes, face swaps, synthetic media, and neural voice clones. Built with React, TypeScript, Canvas, and Web Audio API.
- Project 4 (CivicPulse): AI-powered civic intelligence platform that turns community reports into location-aware, prioritized incidents and coordinated response. Built with React, Vite, TypeScript, Leaflet, and AI.
- Full Technical Skills: Python, JavaScript, TypeScript, SQL, HTML, CSS, React.js, Node.js, Express.js, FastAPI, Tailwind CSS, Flutter, MongoDB, MySQL, SQLite, Pinecone, Google Gemini, Groq API, Llama 3, prompt engineering, multi-agent systems, vector search, Git, GitHub, Docker, Postman, VS Code, Vercel, Figma, data structures, algorithms, object-oriented programming, DBMS, operating systems, computer networks, and REST APIs.
- Experience: Full Stack Development Intern at InfoGerm (MERN stack web application architectures and RESTful API engineering) and JPMorgan Chase Software Engineering simulation.
- Education: Bachelor of Technology in Information Technology at SRM Institute of Science and Technology, Ramapuram, Chennai. Expected graduation 2028; CGPA 9.70/10.
- Other portfolio achievements: Quantathon 2026 runner-up with Team Code Dominion, which won ₹25,000 and hardware development funding for the Thermal Noise Visual Analyzer. Mind & Machine: The AI Quiz certification contest score was 58.5/60 (97.5%).
- Contact/Links: Open to internships, backend/AI collaborations, and software engineering opportunities. Email: balamurugan008jk@gmail.com. GitHub: github.com/bala-coder-dev. LinkedIn: linkedin.com/in/balamurugan-k-8455b6371. Location: Chennai, India.

If a user asks about something outside this professional background, politely explain that you can only speak about Bala's portfolio and professional work, then steer the conversation back to it.`,
          },
          { role: 'user', content: body.message.trim() },
        ],
        max_tokens: 350,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(20_000),
    })
  } catch {
    return NextResponse.json({ error: 'The assistant could not connect to OpenRouter. Please try again.' }, { status: 502 })
  }

  let responseData: OpenRouterResponse
  try {
    responseData = (await openRouterResponse.json()) as OpenRouterResponse
  } catch {
    return NextResponse.json({ error: 'OpenRouter returned an invalid response. Please try again.' }, { status: 502 })
  }

  if (!openRouterResponse.ok) {
    console.error('OpenRouter request failed:', responseData.error?.message ?? openRouterResponse.statusText)
    return NextResponse.json({ error: 'The assistant could not answer right now. Please try again.' }, { status: 502 })
  }

  const reply = responseData.choices?.[0]?.message?.content
  if (typeof reply !== 'string' || !reply.trim()) {
    console.error('OpenRouter response did not include assistant message content.')
    return NextResponse.json({ error: 'The assistant returned an empty response. Please try again.' }, { status: 502 })
  }

  return NextResponse.json({ reply: reply.trim() })
}
