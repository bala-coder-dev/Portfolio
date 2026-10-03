'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useDragControls, useMotionValue } from 'framer-motion'

const skills = 'Python · TypeScript · JavaScript · SQL · React.js · Node.js · Express.js · FastAPI · MongoDB · MySQL · SQLite · Pinecone · Google Gemini · Groq · Llama 3 · Docker · Git'
const projectDetails = [
  'SME Nexus AI — multi-agent executive boardroom; React, TypeScript, Node.js, Express, Gemini, Pinecone.',
  'PR Review Copilot — AI pull-request review pipeline; FastAPI, Groq, Llama 3, SQLite.',
]
const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]'

type TerminalEntry = {
  command?: string
  output: string
  resumeLink?: boolean
}

export function MatrixText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const [displayText, setDisplayText] = useState(text)
  const timerRef = useRef<number | null>(null)

  const scramble = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text)
      return
    }

    if (timerRef.current !== null) window.clearInterval(timerRef.current)
    let frame = 0
    const totalFrames = 14
    timerRef.current = window.setInterval(() => {
      frame += 1
      setDisplayText(
        text
          .split('')
          .map((character, index) => {
            if (character === ' ' || index < Math.floor((frame / totalFrames) * text.length)) return character
            return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)]
          })
          .join(''),
      )

      if (frame >= totalFrames) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current)
        timerRef.current = null
        setDisplayText(text)
      }
    }, 24)
  }, [text])

  const handleMouseEnter = () => {
    if (timerRef.current !== null) return
    scramble()
  }

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current)
  }, [])

  return (
    <span className={className} onMouseEnter={handleMouseEnter} aria-label={text}>
      <span aria-hidden="true">{displayText}</span>
    </span>
  )
}

export function DesktopWindow({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  const windowRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [constraints, setConstraints] = useState({ left: -120, right: 120, top: -80, bottom: 80 })

  useEffect(() => {
    const update = () => {
      setIsDesktop(window.matchMedia('(min-width: 768px) and (pointer: fine)').matches)
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        setConstraints({
          left: Math.min(0, 16 - rect.left),
          right: Math.max(0, window.innerWidth - rect.right - 16),
          top: Math.min(0, 88 - rect.top),
          bottom: Math.max(0, window.innerHeight - rect.bottom - 16),
        })
      }
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (isDesktop && !isMaximized) dragControls.start(event)
  }

  useEffect(() => {
    if (isMaximized) {
      x.set(0)
      y.set(0)
    }
  }, [isMaximized, x, y])

  return (
    <motion.div
      ref={windowRef}
      style={{ x, y }}
      drag={isDesktop && !isMaximized && !isMinimized}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={constraints}
      dragElastic={0.06}
      dragMomentum={false}
      className={`desktop-window ${isMaximized ? 'desktop-window-maximized' : ''} ${isMinimized ? 'desktop-window-minimized' : ''} ${className}`}
    >
      <header className="desktop-window-titlebar" onPointerDown={startDrag}>
        <div className="flex items-center gap-2" aria-label="Window controls">
          <button type="button" aria-label="Reset window position" title="Reset window position" className="desktop-window-dot bg-[#ff5f57]" onPointerDown={(event) => event.stopPropagation()} onClick={() => { x.set(0); y.set(0); setIsMinimized(false); setIsMaximized(false) }} />
          <button type="button" aria-label={isMinimized ? 'Restore window' : 'Minimize window'} title={isMinimized ? 'Restore' : 'Minimize'} className="desktop-window-dot bg-[#febc2e]" onPointerDown={(event) => event.stopPropagation()} onClick={() => setIsMinimized((value) => !value)} />
          <button type="button" aria-label={isMaximized ? 'Restore window size' : 'Maximize window'} title={isMaximized ? 'Restore' : 'Maximize'} className="desktop-window-dot bg-[#28c840]" onPointerDown={(event) => event.stopPropagation()} onClick={() => { setIsMinimized(false); setIsMaximized((value) => !value) }} />
        </div>
        <span className="truncate px-3 font-mono text-[10px] tracking-[0.12em] text-zinc-400">{title}</span>
        <span className="w-[52px]" aria-hidden="true" />
      </header>
      {!isMinimized && <div>{children}</div>}
    </motion.div>
  )
}

export function SystemStatusHud() {
  const [uptime, setUptime] = useState(0)
  const [memory, setMemory] = useState(44)
  const [agentLoad, setAgentLoad] = useState(61)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setUptime(Math.floor((Date.now() - startedAt.current) / 1000))
      setMemory(42 + Math.floor(Math.random() * 7))
      setAgentLoad(38 + Math.floor(Math.random() * 41))
    }, 1200)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let frame = 0
    let phase = 0
    let width = 0
    let height = 0
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = () => {
      phase += 0.025
      context.clearRect(0, 0, width, height)
      context.beginPath()
      for (let x = 0; x <= width; x += 2) {
        const lineY =
          height * 0.52 +
          Math.sin(x * 0.045 + phase) * height * 0.2 +
          Math.sin(x * 0.09 - phase * 1.3) * height * 0.08
        if (x === 0) context.moveTo(x, lineY)
        else context.lineTo(x, lineY)
      }
      context.strokeStyle = 'rgba(94, 234, 212, 0.82)'
      context.lineWidth = 1.4
      context.stroke()
      if (!prefersReducedMotion) frame = window.requestAnimationFrame(draw)
    }

    resize()
    frame = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${remainingSeconds}`
  }

  return (
    <section className="system-hud" aria-label="Simulated system status">
      <div className="system-hud-heading">
        <span className="system-live-dot" />
        <span>SYSTEM STATUS</span>
        <span className="ml-auto text-zinc-600">SIMULATED TELEMETRY</span>
      </div>
      <div className="system-hud-metrics">
        <div><span>UPTIME</span><strong>{formatUptime(uptime)}</strong></div>
        <div><span>MEMORY</span><strong>{memory}%</strong></div>
        <div><span>LLM PING</span><strong>45<span className="text-xs">ms</span></strong></div>
        <div><span>AGENT LOAD</span><strong>{agentLoad}%</strong></div>
      </div>
      <div className="system-hud-chart">
        <span>TRAFFIC / TOKENS PER SECOND</span>
        <canvas ref={canvasRef} aria-label="Animated simulated traffic waveform" role="img" />
      </div>
    </section>
  )
}

export function TerminalMode({
  isOpen,
  onClose,
  onToggle,
}: {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
}) {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { output: 'Bala.dev interactive shell · type help to list commands.' },
  ])
  const [command, setCommand] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const boundsRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

      if ((event.key === '`' || event.key === '~') && !isTyping) {
        event.preventDefault()
        if (isOpen) onClose()
        else onToggle()
      }
      if (event.key === 'Escape' && isOpen) onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onToggle])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' })
  }, [entries])

  const runCommand = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const value = command.trim()
    if (!value) return
    const normalized = value.toLowerCase()
    setCommand('')

    if (normalized === 'clear') {
      setEntries([])
      return
    }

    let output = ''
    let resumeLink = false
    if (normalized === 'help') {
      output = 'Available commands:\n  help              list commands\n  clear             clear terminal output\n  cat skills         show Bala’s core tech stack\n  cat projects       show featured projects\n  cat resume         download Bala’s resume\n  sudo get-resume    download Bala’s resume'
    } else if (normalized === 'cat skills') {
      output = skills
    } else if (normalized === 'cat projects') {
      output = projectDetails.join('\n')
    } else if (normalized === 'cat resume' || normalized === 'sudo get-resume') {
      output = 'Resume PDF ready:'
      resumeLink = true
    } else {
      output = `command not found: ${value}. Type help to see available commands.`
    }

    setEntries((current) => [...current, { command: value, output, resumeLink }])
  }

  const startWindowDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest('button')) return
    dragControls.start(event)
  }

  if (!isOpen) return null

  return (
    <div ref={boundsRef} className="cli-overlay" role="dialog" aria-modal="false" aria-label="Interactive portfolio terminal">
      <motion.div
        className="cli-window"
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={boundsRef}
        dragElastic={0.04}
        dragMomentum={false}
      >
        <header className="cli-titlebar" onPointerDown={startWindowDrag}>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="desktop-window-dot bg-[#ff5f57]" />
            <span className="desktop-window-dot bg-[#febc2e]" />
            <span className="desktop-window-dot bg-[#28c840]" />
          </div>
          <span>balamurugan@portfolio: ~</span>
          <button type="button" onClick={onClose} aria-label="Close terminal" className="cli-close">ESC</button>
        </header>
        <div className="cli-output" ref={outputRef}>
          <p className="cli-welcome">BALA.DEV // INTERACTIVE PORTFOLIO SHELL</p>
          <p className="cli-muted">Try a command:</p>
          <div className="cli-command-hints" aria-label="Example terminal commands">
            <code>help</code>
            <code>cat skills</code>
            <code>cat projects</code>
            <code>cat resume</code>
          </div>
          <p className="cli-muted">Press <span className="cli-accent">Esc</span> or <span className="cli-accent">`</span> to close</p>
          {entries.map((entry, index) => (
            <div key={`${entry.command ?? 'welcome'}-${index}`} className="cli-entry">
              {entry.command && <p className="cli-command"><span>$</span> {entry.command}</p>}
              <p className="cli-result">{entry.output}</p>
              {entry.resumeLink && (
                <a className="cli-download" href="/resume.pdf" download="Balamurugan-K-Resume.pdf">
                  Download Balamurugan-K-Resume.pdf ↧
                </a>
              )}
            </div>
          ))}
        </div>
        <form className="cli-input-row" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="cli-command" className="cli-prompt">$</label>
          <input
            ref={inputRef}
            id="cli-command"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={runCommand}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command"
            placeholder="type a command..."
          />
          <span className="cli-cursor" aria-hidden="true">▋</span>
        </form>
      </motion.div>
    </div>
  )
}
