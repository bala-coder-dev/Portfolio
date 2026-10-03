'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'

const quickPrompts = [
  "[ Chat with Bala's AI ]",
  '[ Ask about SME Nexus AI project ]',
  "[ What are Bala's core skills? ]",
]

type ChatMessage = {
  role: 'assistant' | 'visitor'
  text: string
}

export function DotMatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let pixelRatio = 1
    let frame = 0
    let pointerX = -1000
    let pointerY = -1000
    let targetX = -1000
    let targetY = -1000
    let strength = 0
    let targetStrength = 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      draw()
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const spacing = 28

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const dx = x - pointerX
          const dy = y - pointerY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const influence = Math.max(0, 1 - distance / 150) ** 2 * strength
          const offset = influence * 7
          const shiftX = distance ? (dx / distance) * offset : 0
          const shiftY = distance ? (dy / distance) * offset : 0
          const radius = 0.8 + influence * 0.45

          context.fillStyle = `rgba(67, 163, 151, ${0.13 + influence * 0.22})`
          context.beginPath()
          context.arc(x + shiftX, y + shiftY, radius, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    const animate = () => {
      pointerX += (targetX - pointerX) * 0.16
      pointerY += (targetY - pointerY) * 0.16
      strength += (targetStrength - strength) * 0.12
      draw()

      if (
        Math.abs(targetX - pointerX) > 0.5 ||
        Math.abs(targetY - pointerY) > 0.5 ||
        Math.abs(targetStrength - strength) > 0.01
      ) {
        frame = window.requestAnimationFrame(animate)
      } else {
        pointerX = targetX
        pointerY = targetY
        strength = targetStrength
        draw()
        frame = 0
      }
    }

    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (prefersReducedMotion || event.pointerType === 'touch') return
      targetX = event.clientX
      targetY = event.clientY
      targetStrength = 1
      requestDraw()
    }

    const onPointerLeave = () => {
      targetStrength = 0
      requestDraw()
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="dot-matrix-canvas" />
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
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
  }, [messages])

  const sendMessage = async (message: string) => {
    const text = message.trim()
    if (!text || isSending) return
    setMessages((current) => [...current, { role: 'visitor', text }])
    setInput('')
    setIsSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
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
      <section
        aria-label="Chat with Bala's portfolio assistant"
        aria-hidden={!isOpen}
        className={`portfolio-chat-panel ${isOpen ? 'is-open' : ''}`}
      >
        <header className="flex items-center justify-between border-b border-teal-300/15 px-4 py-3">
          <div>
            <p className="font-mono text-xs text-teal-200">bala.assistant</p>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">LOCAL PORTFOLIO GUIDE</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="rounded p-2 font-mono text-zinc-400 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300"
          >
            ×
          </button>
        </header>
        <div className="portfolio-chat-messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-zinc-300">
                Hi, I can help you explore Bala&apos;s work, experience, and technical toolkit.
              </p>
              <div className="flex flex-col items-start gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    disabled={isSending}
                    className="rounded border border-teal-300/20 px-3 py-2 text-left font-mono text-[10px] leading-4 text-teal-100 transition hover:border-teal-200/50 hover:bg-teal-300/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300"
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
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-teal-300/15 p-3">
          <label className="sr-only" htmlFor="portfolio-chat-input">
            Ask Bala's portfolio assistant
          </label>
          <input
            id="portfolio-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={1000}
            disabled={isSending}
            placeholder="Type a question..."
            className="min-w-0 flex-1 rounded border border-white/10 bg-[#080f14] px-3 py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-teal-300/50 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isSending}
            className="rounded border border-teal-300/25 px-3 font-mono text-xs text-teal-100 transition hover:bg-teal-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↗
          </button>
        </form>
      </section>
      <button
        type="button"
        aria-label={isOpen ? 'Close portfolio chat' : 'Open portfolio chat'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="portfolio-chat-trigger"
      >
        <span aria-hidden="true">{isOpen ? '×' : '>_'}</span>
      </button>
    </div>
  )
}
