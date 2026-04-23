'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const suggestions = [
  'Ask me something risky',
  'What do you actually think about me?',
  'Be brutally honest for once',
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function MessagePage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    setLoading(true)
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
    } catch (e) {
      console.error(e)
    }
    router.push('/done')
  }

  const applySuggestion = (s: string) => {
    setMessage(s)
  }

  return (
    <main className="bg-mesh min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-16 right-10 w-56 h-56 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F2C4CE, transparent)' }} />
      <div className="absolute bottom-20 left-16 w-72 h-72 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #EDD9C0, transparent)' }} />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="glass-card rounded-4xl p-8 md:p-10">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-4xl mb-6 inline-block animate-float">
            💌
          </motion.div>

          <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="font-display text-sm italic text-rose/70 mb-3 tracking-wider">
            anonymous message
          </motion.p>

          <motion.h2 custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="font-display text-3xl md:text-4xl font-light text-warm-brown mb-2">
            Say something you
          </motion.h2>
          <motion.h2 custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="font-display text-3xl md:text-4xl font-light italic text-rose mb-8">
            wouldn't say directly.
          </motion.h2>

          {/* Suggestion chips */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mb-5">
            <p className="text-xs text-mocha/50 tracking-wider uppercase font-body mb-3">need a prompt?</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <motion.button
                  key={s}
                  onClick={() => applySuggestion(s)}
                  className="text-xs px-3 py-2 rounded-full border font-body transition-all"
                  style={{
                    borderColor: 'rgba(212,129,143,0.3)',
                    background: 'rgba(247,232,237,0.6)',
                    color: '#8B6355',
                  }}
                  whileHover={{
                    scale: 1.03,
                    background: 'rgba(242,196,206,0.5)',
                    borderColor: 'rgba(212,129,143,0.6)',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
            <textarea
              className="soft-textarea"
              rows={5}
              placeholder="This is your one honest moment…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
            />
            <div className="text-right mt-1">
              <span className="text-xs text-mocha/40 font-body">{message.length}/500</span>
            </div>
          </motion.div>

          <motion.button
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="btn-primary w-full mt-6"
            whileHover={{ scale: message.trim() ? 1.02 : 1 }}
            whileTap={{ scale: message.trim() ? 0.97 : 1 }}
            style={{
              opacity: message.trim() ? 1 : 0.6,
              cursor: message.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Sending…' : 'Send'}
          </motion.button>

          <motion.p custom={7} variants={fadeUp} initial="hidden" animate="visible"
            className="text-center mt-4 text-xs text-mocha/40 tracking-widest uppercase font-body">
            Be real, not disrespectful.
          </motion.p>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => router.push('/')}
        className="mt-8 text-xs text-mocha/40 hover:text-mocha/70 transition-colors font-body tracking-wider"
      >
        ← go back
      </motion.button>
    </main>
  )
}
