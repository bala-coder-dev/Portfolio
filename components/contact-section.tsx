'use client'

import { useState, type FormEvent } from 'react'
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, CodeXml, Mail, Send } from 'lucide-react'

type FormStatus = {
  type: 'success' | 'error'
  message: string
}

const contactLinks = [
  {
    label: 'EMAIL',
    value: 'balamurugan008jk@gmail.com',
    href: 'mailto:balamurugan008jk@gmail.com',
    Icon: Mail,
  },
  {
    label: 'GITHUB',
    value: 'github.com/bala-coder-dev',
    href: 'https://github.com/bala-coder-dev',
    Icon: CodeXml,
  },
  {
    label: 'LINKEDIN',
    value: 'linkedin.com/in/balamurugan-k',
    href: 'https://linkedin.com/in/balamurugan-k',
    Icon: BriefcaseBusiness,
  },
]

export function ContactSection() {
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<FormStatus | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSending) return

    const form = event.currentTarget
    const formData = new FormData(form)
    setIsSending(true)
    setStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      })
      const data: unknown = await response.json()
      const error =
        typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
          ? data.error
          : null

      if (!response.ok) {
        throw new Error(error ?? 'Your message could not be sent. Please try again.')
      }

      form.reset()
      setStatus({ type: 'success', message: 'Message sent. Thanks for reaching out!' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Your message could not be sent. Please try again.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <footer id="contact" className="border-t border-white/[0.07] py-20">
      <p className="label">08 / CONNECT</p>
      <div className="mt-5 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <h2 className="max-w-xl font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Let&apos;s build something <span className="text-violet-300">useful.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-500">
            Open to internships, collaborations, and software engineering opportunities.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {contactLinks.map(({ label, value, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={label === 'EMAIL' ? undefined : '_blank'}
                rel={label === 'EMAIL' ? undefined : 'noreferrer'}
                className="contact-link-card group"
              >
                <span className="contact-link-icon"><Icon size={18} strokeWidth={1.7} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[9px] tracking-[0.2em] text-teal-200/70">{label}</span>
                  <span className="mt-1 block truncate font-mono text-xs text-zinc-200">{value}</span>
                </span>
                <ArrowUpRight className="shrink-0 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-200" size={16} />
              </a>
            ))}
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-teal-300/20 bg-[#0b1218]/95 shadow-2xl shadow-black/20" aria-labelledby="feedback-heading">
          <div className="flex items-center justify-between border-b border-teal-300/15 px-5 py-4">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-[10px] tracking-[0.16em] text-zinc-500">feedback — visitor@portfolio</span>
          </div>
          <div className="p-5 sm:p-6">
            <p className="font-mono text-xs text-teal-200">bala.feedback --send</p>
            <h3 id="feedback-heading" className="mt-3 font-serif text-2xl font-semibold text-white">Leave a message</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Your note will be sent directly to Bala&apos;s inbox.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="feedback-name" className="mb-2 block font-mono text-[10px] tracking-wider text-zinc-400">YOUR NAME</label>
                  <input id="feedback-name" name="name" required maxLength={80} autoComplete="name" placeholder="Name" className="contact-input" />
                </div>
                <div>
                  <label htmlFor="feedback-email" className="mb-2 block font-mono text-[10px] tracking-wider text-zinc-400">YOUR EMAIL</label>
                  <input id="feedback-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" className="contact-input" />
                </div>
              </div>
              <div>
                <label htmlFor="feedback-message" className="mb-2 block font-mono text-[10px] tracking-wider text-zinc-400">MESSAGE</label>
                <textarea id="feedback-message" name="message" required minLength={5} maxLength={3000} rows={5} placeholder="Write your message..." className="contact-input resize-y" />
              </div>
              <button type="submit" disabled={isSending} className="inline-flex items-center gap-2 rounded-md border border-teal-200/30 bg-teal-200/[0.08] px-4 py-3 font-mono text-xs text-teal-100 transition hover:border-teal-200/60 hover:bg-teal-200/[0.13] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-200 disabled:cursor-wait disabled:opacity-60">
                {isSending ? 'SENDING...' : 'SEND MESSAGE'}
                {status?.type === 'success' ? <CheckCircle2 size={15} /> : <Send size={14} />}
              </button>
              {status && (
                <p role="status" className={`text-sm leading-6 ${status.type === 'success' ? 'text-teal-200' : 'text-rose-300'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
      <div className="mt-16 flex justify-between border-t border-white/[0.07] pt-5 font-mono text-[10px] text-zinc-600">
        <span>© 2026 BALAMURUGAN K</span>
        <span>BUILT WITH INTENT</span>
      </div>
    </footer>
  )
}
