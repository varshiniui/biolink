'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function DonePage() {
  const router = useRouter()

  return (
    <main className="bg-mesh min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #D4818F, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #EDD9C0, transparent)' }} />
      </div>

      <div className="relative z-10 text-center max-w-xs mx-auto">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 1 }}
          className="font-display text-xs italic text-rose/50 tracking-widest uppercase mb-10"
        >
          received
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-6xl font-light text-warm-brown leading-tight mb-5"
          style={{ letterSpacing: '-0.02em' }}
        >
          noted.
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="petal-divider mb-7"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.9 }}
          className="font-display text-lg md:text-xl font-light italic text-mocha/70 leading-relaxed mb-12"
        >
          I'll probably think about
          <br />
          what you said.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          onClick={() => router.push('/')}
          className="btn-ghost mx-auto text-xs tracking-widest"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          go back
        </motion.button>

      </div>
    </main>
  )
}