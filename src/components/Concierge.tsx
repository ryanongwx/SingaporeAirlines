import { useEffect, useState } from 'react'
import { ConversationProvider, useConversation } from '@elevenlabs/react'

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined
const SIGNED_URL_ENDPOINT = import.meta.env.VITE_ELEVENLABS_SIGNED_URL_ENDPOINT as
  | string
  | undefined

const displayFont = { fontFamily: "'Instrument Serif', serif" }

export function Concierge() {
  return (
    <ConversationProvider>
      <ConciergeInner />
    </ConversationProvider>
  )
}

function ConciergeInner() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<
    { role: 'user' | 'agent'; text: string }[]
  >([])

  const conversation = useConversation({
    onConnect: () => setError(null),
    onDisconnect: () => {},
    onError: (e) => setError(typeof e === 'string' ? e : 'Connection error'),
    onMessage: (msg: { source: 'user' | 'ai'; message: string }) => {
      setTranscript((prev) => [
        ...prev,
        { role: msg.source === 'user' ? 'user' : 'agent', text: msg.message },
      ])
    },
  })

  const status = conversation.status
  const isSpeaking = conversation.isSpeaking
  const active = status === 'connected'

  const start = async () => {
    if (!AGENT_ID) {
      setError('Set VITE_ELEVENLABS_AGENT_ID in .env.local')
      return
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      if (SIGNED_URL_ENDPOINT) {
        const res = await fetch(SIGNED_URL_ENDPOINT)
        const { signedUrl } = await res.json()
        await conversation.startSession({ signedUrl, connectionType: 'websocket' })
      } else {
        await conversation.startSession({
          agentId: AGENT_ID,
          connectionType: 'websocket',
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start')
    }
  }

  const stop = async () => {
    await conversation.endSession()
  }

  useEffect(() => {
    return () => {
      if (status === 'connected') conversation.endSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="liquid-glass fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full px-5 py-3 text-sm text-foreground shadow-2xl hover:scale-[1.03]"
        aria-label="Open Singapore Airlines Concierge"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${
              active ? 'animate-ping bg-emerald-400/70' : 'bg-white/40'
            }`}
          />
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
              active ? 'bg-emerald-400' : 'bg-white/80'
            }`}
          />
        </span>
        <span className="hidden sm:inline" style={displayFont}>
          Singapore Airlines Concierge
        </span>
        <span className="sm:hidden">Concierge</span>
      </button>

      {open && (
        <div className="liquid-glass fixed bottom-24 right-6 z-50 flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <div className="text-lg leading-none" style={displayFont}>
                Singapore Airlines Concierge
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {active
                  ? isSpeaking
                    ? 'Speaking…'
                    : 'Listening…'
                  : 'Ready when you are'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="flex max-h-[40vh] flex-col gap-3 overflow-y-auto px-5 py-4 text-sm">
            {transcript.length === 0 && !active && (
              <div className="text-muted-foreground">
                Ask about destinations, fares, baggage, or KrisFlyer benefits — in
                your own voice.
              </div>
            )}
            {transcript.map((t, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  t.role === 'user'
                    ? 'ml-auto bg-white/10 text-foreground'
                    : 'border border-white/10 bg-white/[0.03] text-foreground/90'
                }`}
              >
                {t.text}
              </div>
            ))}
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-2 text-xs text-red-300">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
            {!active ? (
              <button
                type="button"
                onClick={start}
                className="liquid-glass flex-1 cursor-pointer rounded-full px-5 py-3 text-sm hover:scale-[1.02]"
              >
                Begin conversation
              </button>
            ) : (
              <button
                type="button"
                onClick={stop}
                className="flex-1 cursor-pointer rounded-full border border-white/15 px-5 py-3 text-sm text-muted-foreground hover:text-foreground"
              >
                End conversation
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
