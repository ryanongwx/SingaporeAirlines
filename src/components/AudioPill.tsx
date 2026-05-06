import { useEffect, useRef, useState } from 'react'

const playedSrcs = new Set<string>()
const AUDIO_PLAY_EVENT = 'audio-pill:play'

let userHasInteracted = false
let pendingPlay: (() => void) | null = null

if (typeof window !== 'undefined') {
  const unlock = () => {
    userHasInteracted = true
    if (pendingPlay) {
      const fn = pendingPlay
      pendingPlay = null
      fn()
    }
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
    window.removeEventListener('touchstart', unlock)
    window.removeEventListener('scroll', unlock)
  }
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
  window.addEventListener('touchstart', unlock, { once: true })
  window.addEventListener('scroll', unlock, { once: true, passive: true })
}

export function AudioPill({ src, label }: { src: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const wrapRef = useRef<HTMLSpanElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(src, { method: 'HEAD' })
      .then((r) => {
        if (!cancelled) setAvailable(r.ok)
      })
      .catch(() => {
        if (!cancelled) setAvailable(false)
      })
    return () => {
      cancelled = true
    }
  }, [src])

  const startPlayback = () => {
    const a = audioRef.current
    if (!a) return
    window.dispatchEvent(new CustomEvent(AUDIO_PLAY_EVENT, { detail: src }))
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        if (!userHasInteracted) {
          pendingPlay = () => {
            a.play()
              .then(() => setPlaying(true))
              .catch(() => {})
          }
        }
      })
  }

  const stopPlayback = () => {
    const a = audioRef.current
    if (!a) return
    a.pause()
    a.currentTime = 0
    setPlaying(false)
  }

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (playing) stopPlayback()
    else startPlayback()
  }

  useEffect(() => {
    const el = wrapRef.current
    if (!el || !available) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (playedSrcs.has(src)) continue
            playedSrcs.add(src)
            startPlayback()
          }
        }
      },
      { threshold: [0, 0.6, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [available, src])

  useEffect(() => {
    const onOtherPlay = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      if (detail !== src) stopPlayback()
    }
    window.addEventListener(AUDIO_PLAY_EVENT, onOtherPlay)
    return () => window.removeEventListener(AUDIO_PLAY_EVENT, onOtherPlay)
  }, [src])

  if (!available) return null

  return (
    <span ref={wrapRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? 'Stop' : 'Play'} audio guide for ${label}`}
        className="liquid-glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground hover:scale-[1.05]"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${
              playing ? 'animate-ping bg-emerald-400/70' : 'bg-white/60'
            }`}
          />
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
              playing ? 'bg-emerald-400' : 'bg-white/80'
            }`}
          />
        </span>
        {playing ? 'Stop' : 'Listen'}
      </button>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onEnded={() => setPlaying(false)}
      />
    </span>
  )
}
