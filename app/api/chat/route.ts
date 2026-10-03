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

type ConversationTurn = {
  role: 'user' | 'assistant'
  content: string
}

function getPortfolioFallbackReply(message: string, history: ConversationTurn[]) {
  const prompt = message.toLowerCase()
  const context = history.map((turn) => turn.content).join(' ').toLowerCase()
  const projectContext = `${context} ${prompt}`
  const asksForLink = /github|repo|repository|source code|project link|link|url/.test(prompt)

  if (asksForLink && /sme nexus|nexus ai/.test(projectContext)) {
    return 'You can explore SME Nexus AI on GitHub: https://github.com/bala-coder-dev/SME-Nexus-AI'
  }

  if (asksForLink && /pr review|review copilot|pull request/.test(projectContext)) {
    return 'You can explore PR Review Copilot on GitHub: https://github.com/bala-coder-dev/pr-review-copilot'
  }

  if (/sme nexus|nexus ai/.test(prompt)) {
    return 'SME Nexus AI is Bala’s autonomous multi-agent enterprise platform, with seven executive agents coordinated by an AI CEO. It uses React, TypeScript, Node.js, Express, Gemini, and Pinecone, and was a finalist project at Agentic Arena 2026. GitHub: https://github.com/bala-coder-dev/SME-Nexus-AI'
  }

  if (/pr review|review copilot|pull request/.test(prompt)) {
    return 'PR Review Copilot automates pull-request reviews using GitHub webhooks, tree-sitter parsing, FastAPI, Groq, Llama 3, and SQLite. GitHub: https://github.com/bala-coder-dev/pr-review-copilot'
  }

  if (/github|github link|profile/.test(prompt)) {
    return 'Bala’s GitHub profile is https://github.com/bala-coder-dev. His featured projects include SME Nexus AI (https://github.com/bala-coder-dev/SME-Nexus-AI) and PR Review Copilot (https://github.com/bala-coder-dev/pr-review-copilot).'
  }

  if (/skill|tech stack|technology/.test(prompt)) {
    return 'Bala’s core skills include Python, JavaScript, TypeScript, SQL, React, Node.js, Express, FastAPI, MongoDB, MySQL, SQLite, and Pinecone. He also works with Gemini, Groq, Llama 3, multi-agent systems, vector search, Docker, and Git.'
  }

  if (/achievement|award|quantathon|agentic arena|mind.?&.?machine/.test(prompt)) {
    return 'Bala was a finalist at Agentic Arena 2026 with SME Nexus AI and won second prize at Quantathon 2026. He also scored 97.5% in the Mind & Machine AI Quiz.'
  }

  if (/education|college|university|cgpa|graduat/.test(prompt)) {
    return 'Bala is a third-year B.Tech Information Technology student at SRM Institute of Science and Technology, Ramapuram, Chennai. He has a CGPA of 9.70/10 and is expected to graduate in 2028.'
  }

  if (/experience|intern|jpmorgan/.test(prompt)) {
    return 'Bala completed a Full Stack Development internship at InfoGerm, working on MERN applications and REST APIs, and a Software Engineering virtual experience with JPMorgan Chase & Co.'
  }

  if (/contact|email|hire|linkedin/.test(prompt)) {
    return 'Bala is open to internships and backend or AI collaborations. Email: balamurugan008jk@gmail.com · LinkedIn: https://linkedin.com/in/balamurugan-k-8455b6371'
  }

  return 'Bala is a third-year Information Technology student and software engineer focused on full-stack development and AI systems. Ask me about his projects, skills, education, experience, achievements, or contact details.'
}

function isRecruiterQuestion(message: string) {
  return /\b(recruiter|recruit|hire|hiring|why should .*bala|why .*hire|reason(s)? to hire|why choose .*bala)\b/i.test(
    message,
  )
}

function getRecruiterReply() {
  return 'Bala brings practical full-stack and AI engineering experience, demonstrated through projects like SME Nexus AI (a finalist at Agentic Arena 2026) and PR Review Copilot, alongside a Full Stack Development internship at InfoGerm. His 9.70/10 CGPA and second-place finish at Quantathon 2026 add strong evidence of technical ability and consistent execution; he is a promising candidate for internships or junior software engineering roles where he can contribute and continue to grow.'
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        code: 'CHAT_NOT_CONFIGURED',
        error: 'The portfolio assistant is missing its server API key. Configure OPENROUTER_API_KEY and restart the server.',
      },
      { status: 503 },
    )
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

  const history = 'history' in body ? body.history : []
  if (
    !Array.isArray(history) ||
    history.length > 12 ||
    history.some(
      (turn) =>
        typeof turn !== 'object' ||
        turn === null ||
        !('role' in turn) ||
        (turn.role !== 'user' && turn.role !== 'assistant') ||
        !('content' in turn) ||
        typeof turn.content !== 'string' ||
        turn.content.length > 1000,
    )
  ) {
    return NextResponse.json({ error: 'Conversation history is invalid.' }, { status: 400 })
  }

  const conversationHistory = history as ConversationTurn[]
  if (isRecruiterQuestion(body.message)) {
    return NextResponse.json({ reply: getRecruiterReply() })
  }

  const messages = [
    {
      role: 'system',
      content: `You are Balamurugan K's (Bala's) personal AI Portfolio Assistant. Answer questions professionally, confidently, and concisely in 2-3 sentences. For recruiter or hiring questions, make a specific evidence-based case using relevant projects, internship experience, academic performance, and achievements; avoid generic prompts to ask about portfolio topics or unsupported claims.

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
    ...conversationHistory,
    { role: 'user', content: body.message.trim() },
  ]
  const models = [
    'qwen/qwen3.8-27b:free',
    'google/gemma-4-31b-it:free',
  ]

  for (const model of models) {
    let response: Response
    try {
      response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
          'X-Title': "Bala's Portfolio Assistant",
        },
        body: JSON.stringify({ model, messages, max_tokens: 350, temperature: 0.4 }),
        signal: AbortSignal.timeout(20_000),
      })
    } catch (error) {
      console.error(`OpenRouter request failed for ${model}:`, error)
      continue
    }

    let responseData: OpenRouterResponse
    try {
      responseData = (await response.json()) as OpenRouterResponse
    } catch (error) {
      console.error(`OpenRouter returned invalid JSON for ${model}:`, error)
      continue
    }

    if (response.status !== 200) {
      console.error(
        `OpenRouter request failed for ${model} (${response.status}):`,
        responseData.error?.message ?? response.statusText,
      )
      continue
    }

    const reply = responseData.choices?.[0]?.message?.content
    if (typeof reply === 'string' && reply.trim()) {
      return NextResponse.json({ reply: reply.trim() })
    }

    console.error(`OpenRouter response did not include assistant message content for ${model}.`)
  }

  return NextResponse.json({ reply: getPortfolioFallbackReply(body.message, conversationHistory) })
}
