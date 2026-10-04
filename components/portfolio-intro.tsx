'use client'

import { useEffect, useState } from 'react'

export function PortfolioIntro() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches) {
      setIsVisible(false)
      return
    }

    const restoreScroll = () => document.documentElement.classList.remove('portfolio-intro-open')
    const closeIntro = () => {
      restoreScroll()
      setIsVisible(false)
    }

    document.documentElement.classList.add('portfolio-intro-open')
    const exitTimeout = window.setTimeout(() => setIsExiting(true), 3900)
    const closeTimeout = window.setTimeout(closeIntro, 5250)
    const closeForReducedMotion = (event: MediaQueryListEvent) => {
      if (event.matches) closeIntro()
    }

    motionPreference.addEventListener('change', closeForReducedMotion)

    return () => {
      window.clearTimeout(exitTimeout)
      window.clearTimeout(closeTimeout)
      motionPreference.removeEventListener('change', closeForReducedMotion)
      restoreScroll()
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className={`portfolio-intro${isExiting ? ' is-exiting' : ''}`} role="status" aria-label="Opening portfolio">
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
          <span className="portfolio-intro__connection portfolio-intro__connection--one" />
          <span className="portfolio-intro__connection portfolio-intro__connection--two" />
          <span className="portfolio-intro__connection portfolio-intro__connection--three" />

          <div className="portfolio-intro__skill portfolio-intro__skill--docker">
            <span className="portfolio-intro__skill-icon portfolio-intro__skill-icon--docker"><i /><i /><i /><i /><i /><i /></span>
            <span className="portfolio-intro__skill-copy"><strong>Docker</strong><small>CONTAINERS · DEPLOY</small></span>
            <span className="portfolio-intro__skill-live"><i /> RUNNING</span>
          </div>

          <div className="portfolio-intro__skill portfolio-intro__skill--api">
            <span className="portfolio-intro__skill-icon portfolio-intro__skill-icon--api"><i /><i /><i /></span>
            <span className="portfolio-intro__skill-copy"><strong>FastAPI</strong><small>BACKEND · REST</small></span>
            <span className="portfolio-intro__skill-live"><i /> 200 OK</span>
          </div>

          <div className="portfolio-intro__skill portfolio-intro__skill--database">
            <span className="portfolio-intro__skill-icon portfolio-intro__skill-icon--database"><i /><i /><i /></span>
            <span className="portfolio-intro__skill-copy"><strong>PostgreSQL</strong><small>DATA · VECTOR SEARCH</small></span>
            <span className="portfolio-intro__skill-live"><i /> CONNECTED</span>
          </div>

          <div className="portfolio-intro__skill portfolio-intro__skill--ai">
            <span className="portfolio-intro__skill-icon portfolio-intro__skill-icon--ai"><i /><i /><i /><i /><i /></span>
            <span className="portfolio-intro__skill-copy"><strong>AI systems</strong><small>LLMs · MULTI-AGENT</small></span>
            <span className="portfolio-intro__skill-live"><i /> INFERENCE</span>
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
        <span className="portfolio-intro__loading-status">READY <i /></span>
      </div>
    </div>
  )
}
