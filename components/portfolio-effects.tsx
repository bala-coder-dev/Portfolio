'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, useDragControls } from 'framer-motion'

const quickPrompts = [
  "[ Chat with Bala's AI ]",
  '[ Ask about SME Nexus AI project ]',
  "[ What are Bala's core skills? ]",
]

type ChatMessage = {
  role: 'assistant' | 'visitor'
  text: string
}

async function fetchChatWithNetworkRetry(url: string, init: RequestInit) {
  const maxAttempts = 3

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    let response: Response
    try {
      response = await fetch(url, init)
    } catch (error) {
      if (attempt === maxAttempts - 1) throw error
      await new Promise((resolve) => window.setTimeout(resolve, 700 * 2 ** attempt))
      continue
    }

    return response
  }

  throw new Error('The assistant could not answer right now. Please try again.')
}

export function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    type Particle = {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }

    const connectionDistance = 126
    const pointerDistance = 190
    const maxParticles = 140
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let pixelRatio = 1
    let frame = 0
    let lastFrameTime = 0
    let pointerX = 0
    let pointerY = 0
    let targetPointerX = 0
    let targetPointerY = 0
    let pointerStrength = 0
    let targetPointerStrength = 0
    let isPointerActive = false
    let particles: Particle[] = []

    const createParticles = () => {
      const count = Math.min(maxParticles, Math.max(32, Math.round((width * height) / 15000)))
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = 5 + Math.random() * 13

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1 + Math.random() * 0.65,
        }
      })
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const cellSize = connectionDistance
      const particleCells = new Map<string, number[]>()

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]
        const cellX = Math.floor(particle.x / cellSize)
        const cellY = Math.floor(particle.y / cellSize)
        const key = `${cellX},${cellY}`
        const cell = particleCells.get(key)
        if (cell) cell.push(index)
        else particleCells.set(key, [index])
      }

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]
        const cellX = Math.floor(particle.x / cellSize)
        const cellY = Math.floor(particle.y / cellSize)

        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            const neighbors = particleCells.get(`${cellX + offsetX},${cellY + offsetY}`)
            if (!neighbors) continue

            for (const neighborIndex of neighbors) {
              if (neighborIndex <= index) continue
              const neighbor = particles[neighborIndex]
              const dx = neighbor.x - particle.x
              const dy = neighbor.y - particle.y
              const distance = Math.hypot(dx, dy)
              if (distance >= connectionDistance) continue

              context.beginPath()
              context.moveTo(particle.x, particle.y)
              context.lineTo(neighbor.x, neighbor.y)
              context.strokeStyle = `rgba(37, 137, 128, ${(1 - distance / connectionDistance) * 0.13})`
              context.lineWidth = 0.7
              context.stroke()
            }
          }
        }

        if (isPointerActive && pointerStrength > 0.01) {
          const dx = pointerX - particle.x
          const dy = pointerY - particle.y
          const distance = Math.hypot(dx, dy)

          if (distance < pointerDistance) {
            context.beginPath()
            context.moveTo(particle.x, particle.y)
            context.lineTo(pointerX, pointerY)
            context.strokeStyle = `rgba(53, 205, 184, ${(1 - distance / pointerDistance) * 0.24 * pointerStrength})`
            context.lineWidth = 0.85
            context.stroke()
          }
        }

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = 'rgba(47, 132, 125, 0.38)'
        context.fill()
      }
    }

    const animate = (timestamp: number) => {
      const elapsed = lastFrameTime ? Math.min((timestamp - lastFrameTime) / 1000, 0.05) : 0
      lastFrameTime = timestamp

      if (!motionPreference.matches) {
        for (const particle of particles) {
          particle.x += particle.vx * elapsed
          particle.y += particle.vy * elapsed

          if (particle.x < 0 || particle.x > width) particle.vx *= -1
          if (particle.y < 0 || particle.y > height) particle.vy *= -1
          particle.x = Math.max(0, Math.min(width, particle.x))
          particle.y = Math.max(0, Math.min(height, particle.y))
        }

        pointerX += (targetPointerX - pointerX) * 0.18
        pointerY += (targetPointerY - pointerY) * 0.18
        pointerStrength += (targetPointerStrength - pointerStrength) * 0.12
      }

      draw()
      frame = motionPreference.matches || document.hidden ? 0 : window.requestAnimationFrame(animate)
    }

    const requestFrame = () => {
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      targetPointerX = event.clientX
      targetPointerY = event.clientY
      isPointerActive = true
      targetPointerStrength = 1
      if (motionPreference.matches) {
        pointerX = targetPointerX
        pointerY = targetPointerY
        pointerStrength = 1
      }
      requestFrame()
    }

    const onPointerLeave = () => {
      isPointerActive = false
      targetPointerStrength = 0
      requestFrame()
    }

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      createParticles()
      draw()
    }

    const onMotionPreferenceChange = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      lastFrameTime = 0
      if (motionPreference.matches) {
        pointerStrength = 0
        targetPointerStrength = 0
        draw()
      } else {
        requestFrame()
      }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame)
        frame = 0
      } else {
        lastFrameTime = 0
        requestFrame()
      }
    }

    resize()
    if (!motionPreference.matches) requestFrame()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionPreference.addEventListener('change', onMotionPreferenceChange)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionPreference.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="neural-network-canvas" />
}

export function MagneticTargets() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = document.querySelectorAll<HTMLElement>(
      '#home a[href="#projects"], #home a[href="https://github.com/bala-coder-dev"]',
    )

    const listeners = Array.from(targets, (target) => {
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return
        const bounds = target.getBoundingClientRect()
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10
        target.style.setProperty('--magnetic-x', `${x}px`)
        target.style.setProperty('--magnetic-y', `${y}px`)
      }
      const onPointerLeave = () => {
        target.style.setProperty('--magnetic-x', '0px')
        target.style.setProperty('--magnetic-y', '0px')
      }

      target.classList.add('magnetic-target')
      target.addEventListener('pointermove', onPointerMove)
      target.addEventListener('pointerleave', onPointerLeave)

      return () => {
        target.classList.remove('magnetic-target')
        target.style.removeProperty('--magnetic-x')
        target.style.removeProperty('--magnetic-y')
        target.removeEventListener('pointermove', onPointerMove)
        target.removeEventListener('pointerleave', onPointerLeave)
      }
    })

    return () => listeners.forEach((cleanup) => cleanup())
  }, [])

  return null
}

export function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [showChatHint, setShowChatHint] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [canDragChat, setCanDragChat] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatDragControls = useDragControls()

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowChatHint(true), 1800)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const update = () => setCanDragChat(window.matchMedia('(min-width: 768px) and (pointer: fine)').matches)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
  }, [messages])

  const sendMessage = async (message: string) => {
    const text = message.trim()
    if (!text || isSending) return
    const conversationHistory = messages.map((entry) => ({
      role: entry.role === 'visitor' ? 'user' : 'assistant',
      content: entry.text,
    }))
    setMessages((current) => [...current, { role: 'visitor', text }])
    setInput('')
    setIsSending(true)

    try {
      const response = await fetchChatWithNetworkRetry('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: conversationHistory }),
      })
      const data: unknown = await response.json()
      const reply =
        typeof data === 'object' && data !== null && 'reply' in data && typeof data.reply === 'string'
          ? data.reply
          : null
      const error =
        typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
          ? data.error
          : null

      if (!response.ok || !reply) {
        throw new Error(error ?? 'The assistant could not answer right now. Please try again.')
      }

      setMessages((current) => [...current, { role: 'assistant', text: reply }])
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'The assistant could not answer right now. Please try again.'
      setMessages((current) => [...current, { role: 'assistant', text: message }])
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="portfolio-chat">
      {!isOpen && showChatHint && (
        <div className="portfolio-chat-hint" role="status">
          <img src="/chatbot-logo.png" alt="" className="h-9 w-9 rounded-md border border-fuchsia-400/20 bg-black object-cover" />
          <span className="min-w-0">
            <span className="block font-mono text-[10px] text-cyan-200">AI ASSISTANT</span>
            <span className="mt-1 block text-xs text-zinc-200">Need a quick answer? Chat with my AI.</span>
          </span>
          <button
            type="button"
            onClick={() => setShowChatHint(false)}
            aria-label="Dismiss chatbot hint"
            className="self-start rounded px-1 text-zinc-500 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300"
          >
            ×
          </button>
        </div>
      )}
      <motion.section
        aria-label="Chat with Bala's portfolio assistant"
        aria-hidden={!isOpen}
        className={`portfolio-chat-panel ${isOpen ? 'is-open' : ''} ${isMinimized ? 'is-minimized' : ''} ${isMaximized ? 'is-maximized' : ''}`}
        drag={canDragChat && isOpen && !isMinimized && !isMaximized}
        dragListener={false}
        dragControls={chatDragControls}
        dragConstraints={{ left: -280, right: 0, top: -420, bottom: 0 }}
        dragElastic={0.05}
        dragMomentum={false}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 10, scale: isOpen ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <header className="portfolio-terminal-titlebar" onPointerDown={(event) => { if (canDragChat) chatDragControls.start(event) }}>
          <div className="flex items-center gap-2" aria-hidden="true">
            <button type="button" aria-label="Close chat window" className="desktop-window-dot bg-[#ff5f57]" onPointerDown={(event) => event.stopPropagation()} onClick={() => { setIsOpen(false); setIsMaximized(false); setIsMinimized(false) }} />
            <button type="button" aria-label={isMinimized ? 'Restore chat window' : 'Minimize chat window'} className="desktop-window-dot bg-[#febc2e]" onPointerDown={(event) => event.stopPropagation()} onClick={() => setIsMinimized((value) => !value)} />
            <button type="button" aria-label={isMaximized ? 'Restore chat window size' : 'Maximize chat window'} className="desktop-window-dot bg-[#28c840]" onPointerDown={(event) => event.stopPropagation()} onClick={() => { setIsMinimized(false); setIsMaximized((value) => !value) }} />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <img src="/chatbot-logo.png" alt="" className="h-7 w-7 rounded border border-fuchsia-400/20 bg-black object-cover" />
            <div className="min-w-0 text-center">
              <p className="truncate font-mono text-[11px] text-zinc-200">AI ASSISTANT</p>
            </div>
          </div>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => {
              setIsOpen(false)
              setIsMaximized(false)
              setIsMinimized(false)
              setShowChatHint(false)
            }}
            aria-label="Close chat"
            className="rounded px-2 py-1 font-mono text-zinc-400 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300"
          >
            ×
          </button>
        </header>
        {!isMinimized && <><div className="portfolio-terminal-session">
          <p className="font-mono text-[10px] text-zinc-500">Welcome to Bala&apos;s portfolio terminal.</p>
          <p className="mt-1 font-mono text-[10px] text-zinc-600">Type a question or choose a command below.</p>
        </div>
        <div className="portfolio-chat-messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="flex flex-col items-start gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setShowChatHint(false)
                      void sendMessage(prompt)
                    }}
                    disabled={isSending}
                    className="portfolio-terminal-command"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[92%] rounded-lg px-3 py-2 text-sm leading-6 ${
                    message.role === 'visitor'
                      ? 'ml-auto border border-teal-300/15 bg-teal-300/[0.08] text-teal-50'
                      : 'border border-white/[0.07] bg-white/[0.03] text-zinc-300'
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {isSending && (
                <p role="status" className="font-mono text-xs text-teal-200/70">
                  Bala&apos;s assistant is thinking...
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="portfolio-terminal-inputbar">
          <label className="sr-only" htmlFor="portfolio-chat-input">
            Ask Bala's portfolio assistant
          </label>
          <span aria-hidden="true" className="font-mono text-sm text-emerald-300">&gt;_</span>
          <input
            id="portfolio-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={1000}
            disabled={isSending}
            placeholder={isSending ? 'processing...' : 'ask about Bala'}
            className="min-w-0 flex-1 bg-transparent py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isSending}
            className="rounded px-2 py-1 font-mono text-xs text-emerald-200 transition hover:bg-emerald-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↵
          </button>
        </form></>}
      </motion.section>
      <button
        type="button"
        aria-label={isOpen ? 'Close portfolio chat' : 'Open portfolio chat'}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            setIsMaximized(false)
            setIsMinimized(false)
          }
          setIsOpen(!isOpen)
          setShowChatHint(false)
        }}
        className="portfolio-chat-trigger"
      >
        {isOpen ? <span aria-hidden="true">×</span> : <img src="/chatbot-logo.png" alt="" className="h-full w-full rounded-full object-cover" />}
      </button>
    </div>
  )
}
