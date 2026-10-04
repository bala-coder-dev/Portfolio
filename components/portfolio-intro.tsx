'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const statusMessages = [
  ['RUNNING', 'INFRASTRUCTURE: ONLINE', 'DEPLOY READY'],
  ['200 OK', 'API: ONLINE', 'LATENCY: 24MS'],
  ['CONNECTED', 'DATABASE: ONLINE', 'REPLICATION READY'],
  ['INFERENCE', 'MODEL: ONLINE', 'PIPELINE READY'],
]

export function PortfolioIntro({ onExitStart }: { onExitStart: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)

  const finishIntro = useCallback(() => {
    document.documentElement.classList.remove('portfolio-intro-open')
    setIsVisible(false)
  }, [])
  const startExit = useCallback(() => {
    setIsExiting(true)
    onExitStart()
  }, [onExitStart])

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches) {
      onExitStart()
      finishIntro()
      return
    }

    document.documentElement.classList.add('portfolio-intro-open')
    const exitTimeout = window.setTimeout(startExit, 3900)
    const closeForReducedMotion = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onExitStart()
        finishIntro()
      }
    }

    motionPreference.addEventListener('change', closeForReducedMotion)

    return () => {
      window.clearTimeout(exitTimeout)
      motionPreference.removeEventListener('change', closeForReducedMotion)
      document.documentElement.classList.remove('portfolio-intro-open')
    }
  }, [finishIntro, onExitStart, startExit])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const statusInterval = window.setInterval(() => {
      setStatusIndex((currentIndex) => (currentIndex + 1) % 3)
    }, 1800)

    return () => window.clearInterval(statusInterval)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      className="portfolio-intro"
      role="status"
      aria-label="Opening portfolio"
      initial={false}
      animate={
        isExiting
          ? { scale: 3, rotateX: -8, opacity: 0, filter: 'blur(10px)' }
          : { scale: 1, rotateX: 0, opacity: 1, filter: 'blur(0px)' }
      }
      transition={
        isExiting
          ? { duration: 1.3, ease: [0.72, 0.02, 0.25, 1] }
          : { duration: 0.2 }
      }
      onAnimationComplete={() => {
        if (isExiting) finishIntro()
      }}
      style={{ transformPerspective: 1200, transformOrigin: '50% 50%', transformStyle: 'preserve-3d' }}
    >
      <div className="portfolio-intro__glow" aria-hidden="true" />
      <div className="portfolio-intro__topline">
        <span className="portfolio-intro__wordmark">BALA<span>.DEV</span></span>
        <span className="portfolio-intro__edition">ENGINEERING <i /> SYSTEMS <i /> AI</span>
      </div>

      <div className="portfolio-intro__content">
        <div className="portfolio-intro__stage" aria-hidden="true">
          <div className="portfolio-intro__floor" />
          <div className="portfolio-intro__orbit portfolio-intro__orbit--outer" />
          <div className="portfolio-intro__orbit portfolio-intro__orbit--inner" />
          <svg className="portfolio-intro__connections" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <defs>
              <filter id="portfolio-node-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {[
              { x: 150, y: 80 },
              { x: 850, y: 80 },
              { x: 180, y: 420 },
              { x: 820, y: 420 },
            ].map(({ x, y }, index) => (
              <g key={`${x}-${y}`}>
                <path d={`M 500 250 L ${x} ${y}`} className="portfolio-intro__connection" />
                <motion.circle
                  r="4"
                  className="portfolio-intro__packet"
                  filter="url(#portfolio-node-glow)"
                  initial={{ cx: 500, cy: 250, opacity: 0 }}
                  animate={{ cx: [500, x], cy: [250, y], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.8, delay: index * 0.28, repeat: Infinity, ease: 'linear' }}
                />
              </g>
            ))}
          </svg>

          <div className="portfolio-intro__skill portfolio-intro__skill--docker">
            <span className="portfolio-intro__skill-icon portfolio-intro__skill-icon--docker"><i /><i /><i /><i /><i /><i /></span>
            <span className="portfolio-intro__skill-copy"><strong>Docker</strong><small>CONTAINERS · DEPLOY</small></span>
            <span className="portfolio-intro__skill-live"><i /><span key={statusIndex}>{statusMessages[0][statusIndex]}</span></span>
          </div>

          <div className="portfolio-intro__skill portfolio-intro__skill--api">
            <span className="portfolio-intro__skill-icon portfolio-intro__skill-icon--api"><i /><i /><i /></span>
            <span className="portfolio-intro__skill-copy"><strong>FastAPI</strong><small>BACKEND · REST</small></span>
            <span className="portfolio-intro__skill-live"><i /><span key={statusIndex}>{statusMessages[1][statusIndex]}</span></span>
          </div>

          <div className="portfolio-intro__skill portfolio-intro__skill--database">
            <span className="portfolio-intro__skill-icon portfolio-intro__skill-icon--database"><i /><i /><i /></span>
            <span className="portfolio-intro__skill-copy"><strong>PostgreSQL</strong><small>DATA · VECTOR SEARCH</small></span>
            <span className="portfolio-intro__skill-live"><i /><span key={statusIndex}>{statusMessages[2][statusIndex]}</span></span>
          </div>

          <div className="portfolio-intro__skill portfolio-intro__skill--ai">
            <span className="portfolio-intro__skill-icon portfolio-intro__skill-icon--ai"><i /><i /><i /><i /><i /></span>
            <span className="portfolio-intro__skill-copy"><strong>AI systems</strong><small>LLMs · MULTI-AGENT</small></span>
            <span className="portfolio-intro__skill-live"><i /><span key={statusIndex}>{statusMessages[3][statusIndex]}</span></span>
          </div>

          <div className="portfolio-intro__monogram">
            <span className="portfolio-intro__monogram-glint" />
            <span>BK</span>
            <small>BACKEND → INTELLIGENCE</small>
          </div>

          <div className="portfolio-intro__cube portfolio-intro__cube--one" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <div className="portfolio-intro__cube portfolio-intro__cube--two" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <div className="portfolio-intro__cube portfolio-intro__cube--three" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        </div>

        <div className="portfolio-intro__caption">
          <p className="portfolio-intro__eyebrow"><i /> SOFTWARE ENGINEER <span>·</span> AI SYSTEMS BUILDER</p>
          <h1>Building what&apos;s <span>next.</span></h1>
          <p className="portfolio-intro__name">Balamurugan K <span>— Chennai, India</span></p>
        </div>
      </div>

      <div className="portfolio-intro__footer">
        <div className="portfolio-intro__progress" aria-hidden="true"><span /></div>
        <span className="portfolio-intro__loading"><i /> CONNECTING SYSTEMS</span>
        <button type="button" className="portfolio-intro__skip" onClick={startExit}>
          SKIP INTRO <span>↗</span>
        </button>
      </div>
    </motion.div>
  )
}
