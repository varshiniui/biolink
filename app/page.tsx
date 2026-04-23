'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="bg-mesh min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F2C4CE, transparent)' }} />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #EDD9C0, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #E8A0B0, transparent)' }} />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Petal icon */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8 text-5xl animate-float inline-block"
        >
        </motion.div>

        {/* Main headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl md:text-6xl font-light text-warm-brown leading-tight mb-4"
          style={{ letterSpacing: '-0.01em' }}
        >
          Judge me.
          <br />
          <span className="italic" style={{ color: '#D4818F' }}>But don't be boring.</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="petal-divider my-6"
        />

        {/* Subtext */}
        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-body text-mocha text-lg font-light tracking-wide mb-10"
        >
          You can be honest… I can handle it.
        </motion.p>

        {/* Buttons */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={() => router.push('/judge')}
            className="btn-primary min-w-[180px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Judge me
          </motion.button>

          <motion.button
            onClick={() => router.push('/message')}
            className="btn-ghost min-w-[220px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Send something anonymous
          </motion.button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 text-xs tracking-widest uppercase text-mocha/40 font-body"
        >
          Be real, not disrespectful.
        </motion.p>
      </div>
    </main>
  )
}
