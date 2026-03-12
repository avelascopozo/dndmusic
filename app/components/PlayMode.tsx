'use client'

import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { MoodLibraryItem, Mood } from '@/types'
import { LocalScene } from './AppShell'

const MOOD_CONFIG: Record<Mood, { label: string; emoji: string; color: string }> = {
  calm:    { label: 'Calma',    emoji: '😌', color: 'bg-emerald-900/60 border-emerald-700 hover:border-emerald-500 text-emerald-300' },
  mystery: { label: 'Misterio', emoji: '🔮', color: 'bg-purple-900/60 border-purple-700 hover:border-purple-500 text-purple-300' },
  tension: { label: 'Tensión',  emoji: '⚠️', color: 'bg-yellow-900/60 border-yellow-700 hover:border-yellow-500 text-yellow-300' },
  combat:  { label: 'Combate',  emoji: '⚔️', color: 'bg-red-900/60 border-red-700 hover:border-red-500 text-red-300' },
  victory: { label: 'Victoria', emoji: '🏆', color: 'bg-amber-900/60 border-amber-700 hover:border-amber-500 text-amber-300' },
  sadness: { label: 'Tristeza', emoji: '😔', color: 'bg-blue-900/60 border-blue-700 hover:border-blue-500 text-blue-300' },
}

const MOOD_ACTIVE: Record<Mood, string> = {
  calm:    'bg-emerald-600/40 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-900/50',
  mystery: 'bg-purple-600/40 border-purple-400 text-purple-200 shadow-lg shadow-purple-900/50',
  tension: 'bg-yellow-600/40 border-yellow-400 text-yellow-200 shadow-lg shadow-yellow-900/50',
  combat:  'bg-red-600/40 border-red-400 text-red-200 shadow-lg shadow-red-900/50',
  victory: 'bg-amber-600/40 border-amber-400 text-amber-200 shadow-lg shadow-amber-900/50',
  sadness: 'bg-blue-600/40 border-blue-400 text-blue-200 shadow-lg shadow-blue-900/50',
}

interface Props {
  scenes: LocalScene[]
  moodLibrary: MoodLibraryItem[]
  activeSceneId: string | null
  activeMood: Mood | null
  onSceneChange: (id: string) => void
  onMoodChange: (mood: Mood) => void
}

export default function PlayMode({
  scenes,
  moodLibrary,
  activeSceneId,
  activeMood,
  onSceneChange,
  onMoodChange,
}: Props) {
  const soundRefs = useRef<Map<string, Howl>>(new Map())
  const moodRef = useRef<Howl | null>(null)
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set())

  const activeScene = scenes.find(s => s.id === activeSceneId)

  // Cuando cambia la escena activa, detener sonidos anteriores y arrancar autoplay
  useEffect(() => {
    // Detener todos los sonidos actuales
    soundRefs.current.forEach(howl => howl.stop())
    soundRefs.current.clear()
    setPlayingSounds(new Set())

    if (!activeScene) return

    const newPlaying = new Set<string>()

    activeScene.sounds.forEach(sound => {
      if (sound.type === 'loop' && sound.autoplay) {
        const howl = new Howl({ src: [sound.file_url], loop: true, volume: 0.6 })
        howl.play()
        soundRefs.current.set(sound.id, howl)
        newPlaying.add(sound.id)
      }
    })

    setPlayingSounds(newPlaying)

    return () => {
      soundRefs.current.forEach(h => h.stop())
      soundRefs.current.clear()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSceneId])

  // Cuando cambia el mood, cambiar la música
  useEffect(() => {
    if (moodRef.current) {
      moodRef.current.fade(0.6, 0, 1500)
      const old = moodRef.current
      setTimeout(() => old.stop(), 1600)
      moodRef.current = null
    }

    if (!activeMood) return

    const tracks = moodLibrary.filter(m => m.mood === activeMood)
    if (tracks.length === 0) return

    const track = tracks[Math.floor(Math.random() * tracks.length)]
    const howl = new Howl({ src: [track.file_url], loop: true, volume: 0 })
    howl.play()
    howl.fade(0, 0.6, 1500)
    moodRef.current = howl

    return () => {
      if (moodRef.current) {
        moodRef.current.stop()
        moodRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMood])

  function toggleSound(sound: LocalScene['sounds'][number]) {
    const existing = soundRefs.current.get(sound.id)

    if (existing) {
      existing.stop()
      soundRefs.current.delete(sound.id)
      setPlayingSounds(prev => { const s = new Set(prev); s.delete(sound.id); return s })
    } else {
      if (sound.type === 'one-shot') {
        const howl = new Howl({ src: [sound.file_url], volume: 0.8 })
        howl.play()
        // one-shots no se trackean como "playing"
      } else {
        const howl = new Howl({ src: [sound.file_url], loop: true, volume: 0.6 })
        howl.play()
        soundRefs.current.set(sound.id, howl)
        setPlayingSounds(prev => new Set([...prev, sound.id]))
      }
    }
  }

  function stopAll() {
    soundRefs.current.forEach(h => h.stop())
    soundRefs.current.clear()
    setPlayingSounds(new Set())
    if (moodRef.current) {
      moodRef.current.stop()
      moodRef.current = null
    }
    onMoodChange(null as unknown as Mood)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] overflow-hidden">
      {/* Barra de mood */}
      <div className="border-b border-stone-800 px-6 py-5 bg-stone-950">
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-display">
          Estado de ánimo — Música global
        </p>
        <div className="flex gap-3 flex-wrap">
          {(Object.keys(MOOD_CONFIG) as Mood[]).map(mood => {
            const cfg = MOOD_CONFIG[mood]
            const isActive = activeMood === mood
            return (
              <button
                key={mood}
                onClick={() => onMoodChange(isActive ? null as unknown as Mood : mood)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  isActive ? MOOD_ACTIVE[mood] : cfg.color
                }`}
              >
                <span className="text-lg">{cfg.emoji}</span>
                {cfg.label}
                {isActive && <span className="text-xs opacity-70">●</span>}
              </button>
            )
          })}

          {(activeMood || playingSounds.size > 0) && (
            <button
              onClick={stopAll}
              className="ml-auto px-4 py-3 rounded-xl border border-stone-700 text-stone-400 hover:text-red-400 hover:border-red-800 text-sm transition-colors"
            >
              ⏹ Parar todo
            </button>
          )}
        </div>
      </div>

      {/* Panel inferior — Escenas + sonidos */}
      <div className="flex flex-1 overflow-hidden">
        {/* Selector de escenas */}
        <aside className="w-56 border-r border-stone-800 bg-stone-950 overflow-y-auto p-3">
          <p className="text-xs uppercase tracking-widest text-stone-500 px-2 py-2 font-display">
            Escenas
          </p>
          {scenes.length === 0 && (
            <p className="text-stone-600 text-xs text-center mt-8 px-3">
              Crea escenas en modo Preparación
            </p>
          )}
          {scenes.map(scene => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene.id)}
              className={`w-full text-left px-3 py-3 rounded-lg mb-1 flex items-center gap-2 transition-colors ${
                activeSceneId === scene.id
                  ? 'bg-amber-600/20 border border-amber-600/50 text-amber-300'
                  : 'hover:bg-stone-800 text-stone-300 border border-transparent'
              }`}
            >
              <span className="text-xl">{scene.emoji}</span>
              <div>
                <p className="text-sm font-medium leading-tight">{scene.name}</p>
                <p className="text-xs text-stone-500">{scene.sounds.length} sonidos</p>
              </div>
              {activeSceneId === scene.id && (
                <span className="ml-auto text-amber-400 text-xs">●</span>
              )}
            </button>
          ))}
        </aside>

        {/* Controles de la escena activa */}
        <div className="flex-1 overflow-y-auto p-6">
          {!activeScene ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-600 gap-3">
              <span className="text-5xl">🎮</span>
              <p className="font-display text-lg">Selecciona una escena para empezar</p>
              {scenes.length === 0 && (
                <p className="text-sm text-stone-700">
                  Primero crea escenas en modo Preparación
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{activeScene.emoji}</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-100">
                    {activeScene.name}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {playingSounds.size} sonido{playingSounds.size !== 1 ? 's' : ''} activo{playingSounds.size !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {activeScene.sounds.length === 0 ? (
                <p className="text-stone-600 text-sm">
                  Esta escena no tiene sonidos. Añádelos en modo Preparación.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {activeScene.sounds.map(sound => {
                    const isPlaying = playingSounds.has(sound.id)
                    const isOneShot = sound.type === 'one-shot'
                    return (
                      <button
                        key={sound.id}
                        onClick={() => toggleSound(sound)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          isPlaying
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-900/30'
                            : isOneShot
                            ? 'bg-purple-900/30 border-purple-800 hover:border-purple-600 text-stone-300'
                            : 'bg-stone-900 border-stone-700 hover:border-stone-500 text-stone-300'
                        }`}
                      >
                        <span className="text-3xl">{sound.emoji}</span>
                        <span className="text-xs text-center leading-tight font-medium">
                          {sound.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isPlaying
                            ? 'bg-amber-500/20 text-amber-400'
                            : isOneShot
                            ? 'bg-purple-900/50 text-purple-400'
                            : 'bg-stone-800 text-stone-500'
                        }`}>
                          {isPlaying ? '▶ activo' : isOneShot ? '⚡ disparar' : '⏸ parado'}
                        </span>
                        {sound.autoplay && !isOneShot && (
                          <span className="text-xs text-emerald-600">auto</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
