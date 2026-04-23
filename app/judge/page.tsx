'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const pageVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -18, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

const optionVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.12 + i * 0.07, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  }),
}

type Round = {
  phase: number
  type: 'personality' | 'scenario' | 'direct'
  question: string
  options: { label: string; reaction: string; weight: number }[]
}

// weight: 0 = incompatible, 1 = neutral, 2 = aligned, 3 = deeply aligned
const rounds: Round[] = [
  // Phase 1 — First contact
  {
    phase: 1, type: 'personality',
    question: 'You see someone alone at a party. You:',
    options: [
      { label: 'Watch them for a while first', reaction: 'careful. i respect that.', weight: 3 },
      { label: 'Walk over immediately', reaction: 'bold. but do you mean it?', weight: 1 },
      { label: 'Wait for eye contact', reaction: 'you read the room. good.', weight: 2 },
      { label: 'Stay where you are', reaction: 'so would i, honestly.', weight: 2 },
    ],
  },
  {
    phase: 1, type: 'personality',
    question: 'Your texting style, honestly:',
    options: [
      { label: 'Short. Always.', reaction: 'i can work with that.', weight: 2 },
      { label: 'Long when it matters', reaction: 'interesting.', weight: 3 },
      { label: 'Leave people on read sometimes', reaction: 'so do i.', weight: 3 },
      { label: 'Immediate replies, always', reaction: 'that would exhaust me.', weight: 0 },
    ],
  },
  {
    phase: 1, type: 'direct',
    question: 'If we were in the same room right now, you\'d:',
    options: [
      { label: 'Pretend not to notice me', reaction: 'liar.', weight: 3 },
      { label: 'Make an excuse to talk to me', reaction: 'honest. i like that.', weight: 2 },
      { label: 'Wait and see what I do', reaction: 'so we\'d both be waiting.', weight: 3 },
      { label: 'Just stare', reaction: 'at least you\'re self-aware.', weight: 1 },
    ],
  },
  // Phase 2 — Friction
  {
    phase: 2, type: 'scenario',
    question: 'We disagree on something. You:',
    options: [
      { label: 'Push back quietly', reaction: 'controlled. i see you.', weight: 3 },
      { label: 'Drop it to keep peace', reaction: 'you\'d resent it later.', weight: 0 },
      { label: 'Need to be right', reaction: 'that would be a problem.', weight: 0 },
      { label: 'Get curious about my side', reaction: 'rare quality.', weight: 3 },
    ],
  },
  {
    phase: 2, type: 'personality',
    question: 'What do you do with people who are hard to read?',
    options: [
      { label: 'Try harder to figure them out', reaction: 'you\'re doing that right now.', weight: 3 },
      { label: 'Lose interest fast', reaction: 'then you\'re not ready for this.', weight: 0 },
      { label: 'Find it attractive', reaction: 'dangerous answer.', weight: 3 },
      { label: 'Feel uneasy around them', reaction: 'i\'d make you uneasy then.', weight: 1 },
    ],
  },
  {
    phase: 2, type: 'scenario',
    question: 'I go quiet for a few days. You:',
    options: [
      { label: 'Give me space without asking', reaction: 'exactly right.', weight: 3 },
      { label: 'Check in once', reaction: 'once is fine. more is not.', weight: 2 },
      { label: 'Assume something\'s wrong with you', reaction: 'don\'t do that.', weight: 0 },
      { label: 'Go quiet too', reaction: 'we\'d disappear together.', weight: 2 },
    ],
  },
  // Phase 3 — Getting closer
  {
    phase: 3, type: 'direct',
    question: 'What would you actually want from me?',
    options: [
      { label: 'Honesty, even when it\'s uncomfortable', reaction: 'you\'d get it.', weight: 3 },
      { label: 'Something consistent', reaction: 'i can\'t promise that.', weight: 1 },
      { label: 'To be surprised', reaction: 'you would be.', weight: 3 },
      { label: 'I don\'t know yet', reaction: 'the only honest answer.', weight: 2 },
    ],
  },
  {
    phase: 3, type: 'personality',
    question: 'When do you feel most like yourself?',
    options: [
      { label: 'Alone, late at night', reaction: 'me too. always.', weight: 3 },
      { label: 'With one specific person', reaction: 'that\'s a lot of trust.', weight: 2 },
      { label: 'When no one\'s watching', reaction: 'that\'s the version i want to see.', weight: 3 },
      { label: 'I\'m always myself', reaction: 'nobody is.', weight: 0 },
    ],
  },
  // Phase 4 — Tension
  {
    phase: 4, type: 'scenario',
    question: 'We\'re alone. The conversation goes quiet. You:',
    options: [
      { label: 'Let it sit', reaction: 'silence doesn\'t scare you. good.', weight: 3 },
      { label: 'Fill it immediately', reaction: 'you\'re uncomfortable with stillness.', weight: 0 },
      { label: 'Look at me', reaction: 'i\'d look back.', weight: 3 },
      { label: 'Check your phone', reaction: 'not the answer i wanted.', weight: 0 },
    ],
  },
  {
    phase: 4, type: 'direct',
    question: 'Honestly. Do you think we\'d get along?',
    options: [
      { label: 'Yes, dangerously well', reaction: 'i think so too.', weight: 3 },
      { label: 'We\'d clash', reaction: 'maybe that\'s the point.', weight: 2 },
      { label: 'I\'m not sure', reaction: 'uncertainty is honest.', weight: 2 },
      { label: 'Probably not', reaction: 'then why are you still here?', weight: 1 },
    ],
  },
  // Phase 5 — Final
  {
    phase: 5, type: 'scenario',
    question: 'If we never actually met. Would you wonder?',
    options: [
      { label: 'Yes. Probably for a while.', reaction: 'same.', weight: 3 },
      { label: 'For a day, maybe', reaction: 'short memory.', weight: 1 },
      { label: 'I\'d rather not admit it', reaction: 'that\'s the truest answer here.', weight: 3 },
      { label: 'No', reaction: 'you\'re lying to yourself.', weight: 0 },
    ],
  },
  {
    phase: 5, type: 'direct',
    question: 'Last one. What does this feel like to you?',
    options: [
      { label: 'A little too accurate', reaction: 'i know.', weight: 3 },
      { label: 'Unsettling in a good way', reaction: 'that was the goal.', weight: 3 },
      { label: 'Like something I didn\'t expect', reaction: 'good.', weight: 2 },
      { label: 'Like I gave too much away', reaction: 'you did. worth it though.', weight: 2 },
    ],
  },
]

const phaseLabels: Record<number, string> = {
  1: 'first contact',
  2: 'friction',
  3: 'getting closer',
  4: 'tension',
  5: 'the end',
}

function getVerdict(score: number, max: number): { line1: string; line2: string; prediction: string } {
  const pct = score / max
  if (pct >= 0.8) return {
    line1: 'this would be dangerous.',
    line2: 'compatible in all the wrong ways.',
    prediction: 'if we ever met. neither of us would walk away easy.',
  }
  if (pct >= 0.6) return {
    line1: 'closer than expected.',
    line2: 'not quite aligned. but close enough to be interesting.',
    prediction: 'we\'d orbit each other for a while before anything happened.',
  }
  if (pct >= 0.4) return {
    line1: 'interesting friction.',
    line2: 'we\'d push each other in ways neither of us is ready for.',
    prediction: 'it wouldn\'t be easy. but it wouldn\'t be forgettable either.',
  }
  return {
    line1: 'not what i expected.',
    line2: 'we probably wouldn\'t understand each other.',
    prediction: 'and maybe that\'s exactly why you\'re still wondering.',
  }
}

export default function JudgePage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'loading' | 'result'>('intro')
  const [currentRound, setCurrentRound] = useState(0)
  const [answers, setAnswers] = useState<{ round: number; question: string; option: string; weight: number }[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<ReturnType<typeof getVerdict> | null>(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [prevPhase, setPrevPhase] = useState(1)

  const round = rounds[currentRound]

  const handleSelect = (opt: Round['options'][number]) => {
    if (selectedOption) return
    setSelectedOption(opt.label)

    const newAnswers = [...answers, {
      round: currentRound + 1,
      question: round.question,
      option: opt.label,
      weight: opt.weight,
    }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentRound + 1 >= rounds.length) {
        const totalScore = newAnswers.reduce((s, a) => s + a.weight, 0)
        const maxScore = rounds.length * 3
        setVerdict(getVerdict(totalScore, maxScore))
        setGameState('loading')
        setTimeout(() => setGameState('result'), 2600)
      } else {
        setPrevPhase(round.phase)
        setSelectedOption(null)
        setCurrentRound(currentRound + 1)
      }
    }, 950)
  }

  const handleSend = async () => {
    if (!message.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, message, game: 'vibe-check' }),
      })
    } catch (e) {
      console.error(e)
    }
    router.push('/done')
  }

  return (
    <main className="bg-mesh min-h-screen flex flex-col items-center justify-center px-5 py-14 relative overflow-hidden">
      <div className="absolute top-10 right-16 w-52 h-52 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F2C4CE, transparent)' }} />
      <div className="absolute bottom-16 left-10 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #EDD9C0, transparent)' }} />

      <AnimatePresence mode="wait">

        {/* INTRO */}
        {gameState === 'intro' && (
          <motion.div key="intro" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
            className="glass-card rounded-4xl p-9 md:p-11 w-full max-w-md text-center">
            <p className="font-display text-xs italic text-rose/60 tracking-widest uppercase mb-5">12 rounds</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-warm-brown leading-tight mb-3">
              Let's see if<br /><span className="italic text-rose">we make sense.</span>
            </h1>
            <div className="petal-divider my-5" />
            <p className="font-body text-mocha/65 text-sm leading-relaxed mb-3">
              Not about me. Not about you.<br />
              About what happens when two people collide.
            </p>
            <p className="font-body text-mocha/40 text-xs mb-8 italic">answer honestly. i'll know if you don't.</p>
            <motion.button
              onClick={() => setGameState('playing')}
              className="btn-primary mx-auto"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              Find out
            </motion.button>
          </motion.div>
        )}

        {/* PLAYING */}
        {gameState === 'playing' && (
          <motion.div key={`round-${currentRound}`} variants={pageVariants} initial="hidden" animate="visible" exit="exit"
            className="w-full max-w-md">

            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={round.phase}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="font-display text-xs italic tracking-wider"
                    style={{ color: round.phase !== prevPhase ? '#D4818F' : 'rgba(212,129,143,0.55)' }}
                  >
                    {phaseLabels[round.phase]}
                  </motion.span>
                </AnimatePresence>
                <span className="font-body text-xs text-mocha/35">{currentRound + 1} / {rounds.length}</span>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(212,129,143,0.12)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #E8A0B0, #D4818F)' }}
                  animate={{ width: `${((currentRound + 1) / rounds.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="glass-card rounded-4xl p-7 md:p-9">
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="font-body text-xs text-mocha/30 uppercase tracking-widest mb-3"
              >
                {round.type === 'personality' ? 'about you' : round.type === 'scenario' ? 'between us' : 'be direct'}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="font-display text-2xl md:text-3xl font-light text-warm-brown leading-snug mb-7"
              >
                {round.question}
              </motion.h2>

              <div className="flex flex-col gap-2.5">
                {round.options.map((opt, i) => {
                  const isSelected = selectedOption === opt.label
                  const isDimmed = selectedOption && !isSelected
                  return (
                    <motion.button
                      key={opt.label}
                      custom={i}
                      variants={optionVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleSelect(opt)}
                      disabled={!!selectedOption}
                      className="choice-card p-4 text-left"
                      style={{
                        opacity: isDimmed ? 0.28 : 1,
                        borderColor: isSelected ? '#D4818F' : undefined,
                        background: isSelected ? 'rgba(242,196,206,0.38)' : undefined,
                        boxShadow: isSelected ? '0 0 0 2px rgba(212,129,143,0.18)' : undefined,
                        cursor: selectedOption ? 'default' : 'pointer',
                        transition: 'opacity 0.3s ease, border-color 0.2s, background 0.2s',
                      }}
                      whileHover={selectedOption ? {} : { scale: 1.01 }}
                      whileTap={selectedOption ? {} : { scale: 0.98 }}
                    >
                      <span className="font-body text-sm text-warm-brown leading-snug">{opt.label}</span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.p
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                            className="font-display text-xs italic text-rose/75"
                          >
                            {opt.reaction}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* LOADING */}
        {gameState === 'loading' && (
          <motion.div key="loading" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
            className="glass-card rounded-4xl p-11 w-full max-w-md text-center">
            <div className="flex gap-2 justify-center mb-5">
              <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="font-display italic text-mocha/55 text-sm">
              calculating the damage
            </motion.p>
          </motion.div>
        )}

        {/* RESULT */}
        {gameState === 'result' && verdict && (
          <motion.div key="result" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
            className="glass-card rounded-4xl p-8 md:p-10 w-full max-w-md">

            <p className="font-display text-xs italic text-rose/55 tracking-widest uppercase mb-4 text-center">verdict</p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-4xl font-light text-warm-brown italic text-center mb-2"
            >
              "{verdict.line1}"
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-body text-sm text-mocha/60 text-center mb-5"
            >
              {verdict.line2}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="p-4 rounded-3xl mb-7 text-center"
              style={{ background: 'rgba(242,196,206,0.18)', border: '1px solid rgba(212,129,143,0.15)' }}
            >
              <p className="font-display text-base italic text-warm-brown leading-relaxed">
                "{verdict.prediction}"
              </p>
            </motion.div>

            <div className="petal-divider mb-6" />

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              <p className="font-display text-lg text-warm-brown mb-1">Now don't play safe.</p>
              <p className="font-body text-mocha/50 text-xs mb-5">
                What do you actually think. About me, about this, about what just happened?
              </p>
              <textarea
                className="soft-textarea"
                rows={4}
                placeholder="Say it honestly."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
              />
              <div className="text-right mt-1 mb-4">
                <span className="text-xs text-mocha/30 font-body">{message.length}/500</span>
              </div>
              <motion.button
                onClick={handleSend}
                disabled={!message.trim() || submitting}
                className="btn-primary w-full"
                style={{ opacity: message.trim() ? 1 : 0.5, cursor: message.trim() ? 'pointer' : 'not-allowed' }}
                whileHover={{ scale: message.trim() ? 1.02 : 1 }}
                whileTap={{ scale: message.trim() ? 0.97 : 1 }}
              >
                {submitting ? 'Sending' : 'Send it'}
              </motion.button>
              <p className="text-center mt-3 text-xs text-mocha/30 tracking-widest uppercase font-body">
                Be real, not disrespectful.
              </p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        onClick={() => router.push('/')}
        className="fixed bottom-7 left-1/2 -translate-x-1/2 text-xs text-mocha/30 hover:text-mocha/55 transition-colors font-body tracking-wider"
      >
        ← go back
      </motion.button>
    </main>
  )
}