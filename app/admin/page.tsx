'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Answer = {
  round: number
  option: string
  reaction: string
}

type Response = {
  id: string
  impression?: string | null
  talk_choice?: string | null
  answers?: Answer[] | null
  message: string | null
  created_at: string
  is_favorite: boolean
  game?: string | null
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'favorites' | 'game'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleLogin = async () => {
    setError('')
    const res = await fetch('/api/messages', {
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      const data = await res.json()
      setResponses(data.responses)
      setAuthed(true)
    } else {
      setError('Wrong password. Try again.')
    }
  }

  const fetchResponses = async () => {
    setLoading(true)
    const res = await fetch('/api/messages', {
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      const data = await res.json()
      setResponses(data.responses)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await fetch('/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id }),
    })
    setResponses((prev) => prev.filter((r) => r.id !== id))
  }

  const handleFavorite = async (id: string, current: boolean) => {
    await fetch('/api/favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id, is_favorite: !current }),
    })
    setResponses((prev) => prev.map((r) => (r.id === id ? { ...r, is_favorite: !current } : r)))
  }

  const displayed = responses.filter((r) => {
    if (filter === 'favorites') return r.is_favorite
    if (filter === 'game') return r.game === 'can-you-read-me'
    return true
  })

  const formatDate = (ts: string) => {
    const d = new Date(ts)
    return (
      d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    )
  }

  if (!authed) {
    return (
      <main className="bg-mesh min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-4xl p-10 w-full max-w-sm text-center"
        >
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="font-display text-3xl font-light text-warm-brown mb-2">Admin</h1>
          <p className="font-body text-mocha/60 text-sm mb-8 italic">private space</p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="admin-input mb-4"
          />
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose mb-4 font-body">
              {error}
            </motion.p>
          )}
          <motion.button onClick={handleLogin} className="btn-primary w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            Enter
          </motion.button>
        </motion.div>
      </main>
    )
  }

  const gameCount = responses.filter((r) => r.game === 'can-you-read-me').length

  return (
    <main className="bg-mesh min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-light text-warm-brown">Responses</h1>
            <p className="font-body text-mocha/60 text-sm mt-1">
              {responses.length} total · {responses.filter((r) => r.is_favorite).length} favorites · {gameCount} game plays
            </p>
          </div>
          <motion.button
            onClick={fetchResponses}
            className="btn-ghost text-xs py-2 px-4"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </motion.button>
        </motion.div>

        {/* Filter tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2 mb-8 flex-wrap">
          {(['all', 'game', 'favorites'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-body text-sm px-5 py-2 rounded-full transition-all capitalize"
              style={{
                background: filter === f ? 'linear-gradient(135deg, #E8A0B0, #D4818F)' : 'rgba(255,255,255,0.6)',
                color: filter === f ? '#FAF6F1' : '#8B6355',
                border: filter === f ? 'none' : '1px solid rgba(237,217,192,0.7)',
                boxShadow: filter === f ? '0 4px 15px rgba(212,129,143,0.3)' : 'none',
              }}
            >
              {f === 'game' ? 'Can You Read Me' : f}
            </button>
          ))}
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {displayed.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="font-display text-2xl italic text-mocha/40">Nothing here yet…</p>
              </motion.div>
            )}

            {displayed.map((r, i) => {
              const isExpanded = expanded === r.id
              const isGame = r.game === 'can-you-read-me'
              const parsedAnswers: Answer[] = Array.isArray(r.answers) ? r.answers : []

              return (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="glass-card rounded-3xl p-6 relative"
                >
                  {r.is_favorite && <div className="absolute top-4 right-4 text-sm">🌸</div>}

                  {/* Badge */}
                  <div className="flex flex-wrap gap-2 mb-4 items-center">
                    {isGame ? (
                      <span className="text-xs px-3 py-1 rounded-full font-body"
                        style={{ background: 'rgba(212,129,143,0.2)', color: '#8B6355', border: '1px solid rgba(212,129,143,0.25)' }}>
                        Can You Read Me · {parsedAnswers.length} rounds
                      </span>
                    ) : (
                      <>
                        {r.impression && (
                          <span className="text-xs px-3 py-1 rounded-full font-body"
                            style={{ background: 'rgba(242,196,206,0.4)', color: '#8B6355', border: '1px solid rgba(212,129,143,0.2)' }}>
                            {r.impression}
                          </span>
                        )}
                        {r.talk_choice && (
                          <span className="text-xs px-3 py-1 rounded-full font-body"
                            style={{ background: 'rgba(237,217,192,0.5)', color: '#6B4C3B', border: '1px solid rgba(237,217,192,0.6)' }}>
                            {r.talk_choice}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Message */}
                  {r.message ? (
                    <p className="font-display text-lg italic text-warm-brown leading-relaxed mb-4">
                      "{r.message}"
                    </p>
                  ) : (
                    <p className="font-body text-sm text-mocha/30 italic mb-4">no message</p>
                  )}

                  {/* Expandable answers for game */}
                  {isGame && parsedAnswers.length > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : r.id)}
                        className="font-body text-xs text-rose/70 hover:text-rose transition-colors"
                      >
                        {isExpanded ? '▲ hide answers' : '▼ see all 12 answers'}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 flex flex-col gap-2 overflow-hidden"
                          >
                            {parsedAnswers.map((a) => (
                              <div key={a.round} className="flex gap-3 items-start p-3 rounded-2xl"
                                style={{ background: 'rgba(242,196,206,0.12)', border: '1px solid rgba(242,196,206,0.25)' }}>
                                <span className="font-body text-xs text-mocha/40 shrink-0 mt-0.5">R{a.round}</span>
                                <div>
                                  <p className="font-body text-xs text-warm-brown">{a.option}</p>
                                  <p className="font-display text-xs italic text-rose/60 mt-0.5">{a.reaction}</p>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-mocha/40 font-body">{formatDate(r.created_at)}</p>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleFavorite(r.id, r.is_favorite)}
                        className="text-xs px-3 py-1.5 rounded-full font-body transition-all"
                        style={{
                          background: r.is_favorite ? 'rgba(242,196,206,0.5)' : 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(212,129,143,0.25)',
                          color: '#8B6355',
                        }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        {r.is_favorite ? '★ unfave' : '☆ fave'}
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(r.id)}
                        className="text-xs px-3 py-1.5 rounded-full font-body transition-all"
                        style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(212,129,143,0.2)', color: '#D4818F' }}
                        whileHover={{ scale: 1.05, background: 'rgba(212,129,143,0.1)' }} whileTap={{ scale: 0.95 }}
                      >
                        delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}