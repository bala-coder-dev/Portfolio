'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DotMatrixCanvas, MagneticTargets, PortfolioChat } from '@/components/portfolio-effects'
import { ContactSection } from '@/components/contact-section'
import { DesktopWindow, MatrixText, TerminalMode } from '@/components/advanced-visuals'
import { PortfolioIntro } from '@/components/portfolio-intro'

const projects = [
  { name: 'SME Nexus AI', type: 'AI PLATFORM', desc: 'Autonomous multi-agent boardroom where seven executive agents debate, vote, and turn business data into decisive action plans.', stack: ['React', 'TypeScript', 'Node.js', 'Gemini', 'Pinecone'], color: 'violet', href: 'https://github.com/bala-coder-dev/SME-Nexus-AI' },
  { name: 'PR Review Copilot', type: 'DEVELOPER TOOL', desc: 'AI-powered pull request reviewer that retrieves GitHub diffs and posts structured, syntax-aware engineering feedback.', stack: ['Python', 'FastAPI', 'Groq', 'SQLite'], color: 'cyan', href: 'https://github.com/bala-coder-dev/pr-review-copilot' },
  { name: 'TruthLens', type: 'FORENSIC AI', desc: 'Explainable multimodal forensic inspection platform for detecting deepfakes, face swaps, synthetic media, and neural voice clones.', stack: ['React', 'TypeScript', 'Canvas', 'Web Audio API'], color: 'amber', href: 'https://github.com/bala-coder-dev' },
  { name: 'CivicPulse', type: 'CIVIC INTELLIGENCE', desc: 'AI-powered civic intelligence platform turning community reports into location-aware, prioritized incidents and coordinated response.', stack: ['React', 'Vite', 'TypeScript', 'Leaflet', 'AI'], color: 'emerald', href: 'https://github.com/bala-coder-dev' },
]

const skillGroups = [['LANGUAGES', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'], ['FRAMEWORKS', 'React.js', 'Node.js', 'Express.js', 'FastAPI', 'Tailwind CSS', 'Flutter'], ['DATABASES', 'MongoDB', 'MySQL', 'SQLite', 'Pinecone'], ['AI / ML', 'Google Gemini', 'Groq API', 'Llama 3', 'Prompt Engineering', 'Multi-Agent Systems', 'Vector Search'], ['TOOLS', 'Git', 'GitHub', 'Docker', 'Postman', 'VS Code', 'Vercel', 'Figma'], ['CORE CS', 'Data Structures', 'Algorithms', 'OOP', 'DBMS', 'Operating Systems', 'Networks', 'REST APIs']]

function WindowBar({ label }: { label: string }) { return <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3"><span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /><span className="ml-2 font-mono text-[10px] tracking-[0.16em] text-zinc-500">{label}</span></div> }

export default function Home() {
  const [typed, setTyped] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isIntroExiting, setIsIntroExiting] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const handleIntroExitStart = useCallback(() => setIsIntroExiting(true), [])
  const terminal = '> building scalable, production-grade software\n> full-stack engineering × AI systems\n> status: open_to_opportunities = true'
  useEffect(() => { let i = 0; const id = setInterval(() => { setTyped(terminal.slice(0, i)); i += 1; if (i > terminal.length) clearInterval(id) }, 24); return () => clearInterval(id) }, [])
  useEffect(() => { window.history.replaceState(null, '', '#home'); window.scrollTo({ top: 0, behavior: 'instant' }) }, [])
  const filters = ['ALL', 'AI / ML', 'FULL STACK']
  const visibleProjects = activeFilter === 'ALL' ? projects : projects.filter((p) => activeFilter === 'AI / ML' ? ['SME Nexus AI', 'TruthLens', 'CivicPulse'].includes(p.name) : p.name === 'PR Review Copilot')
  return <main className="relative isolate min-h-screen overflow-hidden bg-[#090a0f] text-zinc-100 selection:bg-violet-500/30">
    <PortfolioIntro onExitStart={handleIntroExitStart} />
    <DotMatrixCanvas />
    <MagneticTargets />
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_75%_5%,rgba(124,58,237,0.13),transparent_31%),radial-gradient(circle_at_15%_45%,rgba(6,182,212,0.06),transparent_27%)]" />
    <motion.div
      className="portfolio-main-content"
      initial={{ opacity: 0, y: 50 }}
      animate={isIntroExiting ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.9, delay: isIntroExiting && !prefersReducedMotion ? 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!isIntroExiting}
      inert={!isIntroExiting}
    >
    <nav className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#090a0f]/90 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 lg:px-8"><a href="#home" aria-label="Bala.dev home" className="brand-lockup flex items-center gap-2.5 font-serif text-2xl font-bold tracking-tight text-white"><img src="/bala-dev-mark.png" alt="" className="brand-mark h-14 w-14 object-contain" /><span>Bala<span className="text-cyan-300">.dev</span></span></a><div className="hidden items-center gap-5 font-serif text-[10px] font-bold tracking-[0.16em] text-zinc-400 lg:flex">{['HOME','ABOUT','SKILLS','PROJECTS','EXPERIENCE','ACHIEVEMENTS','EDUCATION','CONTACT'].map((x) => <a key={x} href={`#${x.toLowerCase()}`} className="transition-colors hover:text-violet-300">{x}</a>)}</div><div className="flex items-center gap-3"><button type="button" onClick={() => setIsTerminalOpen(true)} className="rounded-md border border-teal-300/25 px-3 py-2 font-mono text-[9px] text-teal-200 transition hover:border-teal-200/60 hover:bg-teal-300/[0.07] sm:text-[10px]">[ TERMINAL MODE ]</button><a href="mailto:balamurugan008jk@gmail.com" className="rounded-md border border-violet-400/30 px-3 py-2 font-mono text-[10px] text-violet-300 transition hover:bg-violet-400/10">CONTACT ↗</a></div></div></nav>
    <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
      <section id="home" className="grid min-h-[640px] items-center gap-12 py-16 lg:items-start lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="mb-5 font-mono text-xs tracking-[0.28em] text-cyan-400">
            <MatrixText text="01 / ASPIRING SOFTWARE ENGINEER" />
          </p>
          <h1 className="whitespace-nowrap font-serif text-[clamp(2.5rem,5.5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
            Balamurugan K
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-serif text-sm tracking-wide text-zinc-300 sm:text-base">
            <span>Backend Developer</span><span className="text-teal-300/70" aria-hidden="true">·</span>
            <span>AI Systems Builder</span><span className="text-teal-300/70" aria-hidden="true">·</span>
            <span>DevOps Engineer</span>
          </p>
          <h2 className="mt-9 max-w-3xl font-serif text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Building systems<br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">that think ahead.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
            Building scalable, production-grade software at the intersection of full-stack engineering and AI — with hands-on experience in real-world projects, competitive hackathons, and industry internships.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#projects" className="rounded-md border border-violet-300/30 bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 font-mono text-xs font-semibold text-white shadow-[0_0_28px_rgba(139,92,246,0.28)] transition hover:from-violet-400 hover:to-cyan-400">VIEW PROJECTS <span className="ml-2">↗</span></a>
            <a href="https://github.com/bala-coder-dev" target="_blank" rel="noreferrer" className="rounded-md border border-violet-300/30 bg-gradient-to-r from-violet-500/15 to-cyan-500/15 px-5 py-3 font-mono text-xs font-semibold text-zinc-200 transition hover:border-cyan-300/50 hover:from-violet-500/25 hover:to-cyan-500/25">GITHUB ↗</a>
          </div>
        </div>
        <div className="space-y-4">
          <DesktopWindow title="terminal — bala@portfolio" className="rounded-xl border border-white/[0.09] bg-[#101117]/90 shadow-2xl shadow-violet-950/20">
            <div className="min-h-64 p-5 font-mono text-xs leading-8">
              <p className="text-zinc-600">// welcome.sh</p>
              <p className="terminal-typewriter mt-3 whitespace-pre-line text-emerald-300" aria-live="polite">
                {typed}<span className="animate-pulse text-violet-300">▋</span>
              </p>
              <p className="mt-4 max-w-prose text-[11px] leading-6 text-zinc-400">
                Building scalable, production-grade software at the intersection of full-stack engineering and AI — with hands-on experience in real-world projects, competitive hackathons, and industry internships.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 text-[10px] text-zinc-500">
                <span>LOCATION <b className="block pt-1 font-normal text-zinc-300">Chennai, IN</b></span>
                <span>GRADUATION <b className="block pt-1 font-normal text-zinc-300">2028</b></span>
                <span>CGPA <b className="block pt-1 font-normal text-cyan-300">9.70 / 10</b></span>
                <span>STATUS <b className="block pt-1 font-normal text-emerald-300">AVAILABLE</b></span>
              </div>
            </div>
          </DesktopWindow>
        </div>
      </section>
      <section id="about" className="border-t border-white/[0.07] py-20"><div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="label"><MatrixText text="02 / ABOUT" /></p><h2 className="section-title">Engineering with<br />purpose.</h2></div><div><p className="max-w-2xl text-lg leading-9 text-zinc-400">I&apos;m Balamurugan K, a third-year B.Tech Information Technology student at SRM Institute of Science and Technology, focused on backend engineering, full-stack development, and AI-powered systems.</p><p className="mt-5 max-w-2xl text-lg leading-9 text-zinc-400">I build scalable, production-oriented applications using Python, FastAPI, React, TypeScript, Node.js, REST APIs, and LLMs. My work includes SME Nexus AI, a multi-agent business intelligence platform, and PR Review Copilot, an AI-powered code review assistant.</p><p className="mt-5 max-w-2xl text-lg leading-9 text-zinc-400">A Finalist at Agentic Arena 2026 and Runner-Up at Quantathon 2026, I enjoy solving real-world engineering problems through projects, hackathons, and continuous learning. I&apos;m currently seeking opportunities in software engineering, backend, full-stack, and AI engineering.</p></div></div><div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4"><div className="stat"><b>9.70</b><span>CGPA / 10.00</span></div><div className="stat"><b>4</b><span>LIVE PROJECTS</span></div><div className="stat"><b>3</b><span>COMPETITION AWARDS</span></div><div className="stat"><b>10</b><span>CERTIFICATIONS</span></div></div></section>
      <section id="skills" className="border-t border-white/[0.07] py-20"><p className="label"><MatrixText text="03 / TOOLKIT" /></p><div className="mb-10 flex items-end justify-between gap-4"><h2 className="section-title">Skills board</h2><span className="font-mono text-[10px] text-zinc-600">{skillGroups.flat().length - 6} modules loaded</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{skillGroups.map(([title, ...skills], i) => <div key={title} className={`bento ${i === 3 ? 'lg:col-span-2' : ''}`}><p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-violet-300">{title}</p><div className="flex flex-wrap gap-2">{skills.map((s) => <span key={s} className="tag">{s}</span>)}</div></div>)}</div></section>
      <section id="projects" className="border-t border-white/[0.07] py-20"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="label"><MatrixText text="04 / SELECTED WORK" /></p><h2 className="section-title"><MatrixText text="Project matrix" /></h2></div><div className="flex gap-1 rounded-md border border-white/[0.08] p-1">{filters.map((f) => <button key={f} onClick={() => setActiveFilter(f)} className={`rounded px-3 py-2 font-mono text-[10px] transition ${activeFilter === f ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-300'}`}>{f}</button>)}</div></div><div className="mt-10 grid gap-5 lg:grid-cols-2">{visibleProjects.map((p, i) => <article key={p.name} className="group rounded-xl border border-white/[0.09] bg-[#101117]/80 p-6 transition hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-xl hover:shadow-violet-950/20"><WindowBar label={`project_0${i + 1} / ${p.type.toLowerCase()}`} /><div className="pt-5"><div className="flex items-start justify-between gap-4"><h3 className="font-serif text-2xl font-semibold tracking-tight">{p.name}</h3><a href={p.href} target="_blank" rel="noreferrer" className="font-mono text-xs text-zinc-500 transition group-hover:text-violet-300">↗</a></div><p className="mt-3 text-sm leading-7 text-zinc-400">{p.desc}</p><div className="mt-7 flex flex-wrap gap-2">{p.stack.map((s) => <span key={s} className="tag">{s}</span>)}</div></div></article>)}</div></section>
      <section id="education" className="border-t border-white/[0.07] py-20"><p className="label">05 / ACADEMIC BACKGROUND</p><h2 className="section-title mt-3">Education</h2><div className="mt-8 rounded-xl border-l-4 border-cyan-400 bg-[#101117]/90 p-7 shadow-2xl shadow-cyan-950/10 sm:p-10"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><h3 className="max-w-2xl font-serif text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Bachelor of Technology — Information Technology</h3><p className="mt-5 max-w-xl font-serif text-lg leading-8 text-cyan-300">SRM Institute of Science and Technology, Ramapuram, Chennai</p><p className="mt-3 text-sm text-zinc-400">B.Tech Information Technology · CGPA 9.70 / 10</p><p className="mt-8 text-sm text-zinc-500">Expected Graduation: 2028</p></div><div className="education-cgpa-card" aria-label="Current CGPA: 9.70 out of 10.00"><span className="education-cgpa-label">CURRENT CGPA</span><div className="education-cgpa-score"><strong>9.70</strong><span>/ 10.00</span></div><div className="education-cgpa-meter" role="meter" aria-label="CGPA score" aria-valuemin={0} aria-valuemax={10} aria-valuenow={9.7}><span /></div></div></div></div></section>
      <section id="experience" className="border-t border-white/[0.07] py-20"><p className="label">06 / INDUSTRY</p><h2 className="section-title mb-10">Experience</h2><div className="space-y-5"><article className="rounded-xl border border-white/[0.09] bg-[#101117]/90 p-6 shadow-xl shadow-black/10 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="font-serif text-2xl font-semibold text-white">Full Stack Development Intern</h3><p className="mt-2 font-mono text-xs text-cyan-300">InfoGerm · Chennai</p></div><span className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 font-mono text-[10px] text-white">JUN 2025 — AUG 2025</span></div><ul className="mt-6 space-y-3 text-sm leading-7 text-zinc-400"><li>• Developed responsive full-stack web applications using the MERN stack, focusing on scalable and maintainable application architecture.</li><li>• Designed and integrated RESTful APIs for seamless communication between frontend interfaces and backend services.</li><li>• Managed source code with Git and GitHub while following collaborative development best practices.</li><li>• Deployed full-stack applications and gained practical exposure to debugging, testing, and deployment workflows.</li></ul></article><article className="rounded-xl border border-white/[0.09] bg-[#101117]/90 p-6 shadow-xl shadow-black/10 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="font-serif text-2xl font-semibold text-white">Software Engineering Virtual Experience</h3><p className="mt-2 font-mono text-xs text-cyan-300">JPMorgan Chase &amp; Co. · via Forage</p></div><span className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 font-mono text-[10px] text-white">DECEMBER 2025</span></div><ul className="mt-6 space-y-3 text-sm leading-7 text-zinc-400"><li>• Completed a software engineering simulation focused on solving real-world development challenges through debugging, software design, and problem-solving.</li><li>• Gained practical exposure to software engineering workflows, clean coding practices, and industry-standard development methodologies.</li></ul></article></div></section><section id="achievements" className="border-t border-white/[0.07] py-20"><p className="label">07 / RECOGNITION</p><h2 className="section-title mb-10">Achievements</h2><div className="grid gap-5 lg:grid-cols-3"><article className="bento"><p className="mb-4 text-3xl">01</p><h3 className="font-serif text-2xl font-semibold text-white">Finalist — Agentic Arena 2026</h3><p className="mt-4 text-sm leading-7 text-zinc-400">Recognized among 880+ participants for SME Nexus AI, an autonomous executive boardroom where specialized agents debate and produce strategic decisions.</p></article><article className="bento"><p className="mb-4 text-3xl">02</p><h3 className="font-serif text-2xl font-semibold text-white">Second Prize — Quantathon 2026</h3><p className="mt-4 text-sm leading-7 text-zinc-400">Department of Information Technology, SRMIST. Team Code Dominion won ₹25,000 and secured hardware development funding for the Thermal Noise Visual Analyzer.</p></article><article className="bento"><p className="mb-4 text-3xl">03</p><h3 className="font-serif text-2xl font-semibold text-white">Mind &amp; Machine: The AI Quiz</h3><p className="mt-4 text-sm leading-7 text-zinc-400">Completed the certification contest by Outstanding Koders with AI4Tomorrow, scoring 58.5/60 (97.5%) across AI and machine learning fundamentals.</p></article></div></section>
      <ContactSection />
    </div>
      </motion.div>
      <PortfolioChat />
    <TerminalMode
      isOpen={isTerminalOpen}
      onClose={() => setIsTerminalOpen(false)}
      onToggle={() => setIsTerminalOpen(true)}
    />
  </main>
}
