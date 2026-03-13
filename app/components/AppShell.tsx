'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SoundLibraryItem, MoodLibraryItem, Mood } from '@/types'
import PrepMode from './PrepMode'
import PlayMode from './PlayMode'
import { createClient } from '@/lib/supabase/client'

export interface LocalScene {
  id: string
  name: string
  emoji: string
  sounds: Array<SoundLibraryItem & { autoplay: boolean }>
}

interface Props {
  soundLibrary: SoundLibraryItem[]
  moodLibrary: MoodLibraryItem[]
}

export default function AppShell({ soundLibrary, moodLibrary }: Props) {
  const [mode, setMode] = useState<'prep' | 'play'>('prep')
  const router = useRouter()
  const [scenes, setScenes] = useState<LocalScene[]>([])
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null)
  const [activeMood, setActiveMood] = useState<Mood | null>(null)

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0b0a]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎲</span>
          <h1 className="font-display text-xl font-bold text-amber-400 tracking-widest uppercase">
            DnD Music
          </h1>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-stone-900 rounded-lg p-1 border border-stone-700">
          <button
            onClick={() => setMode('prep')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'prep'
                ? 'bg-amber-600 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📋 Preparación
          </button>
          <button
            onClick={() => setMode('play')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'play'
                ? 'bg-amber-600 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🎮 Play
          </button>
        </div>

        <button
          onClick={async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/auth/login')
          }}
          className="text-xs text-stone-500 hover:text-stone-300 transition-colors px-2 py-1"
        >
          Salir
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {mode === 'prep' ? (
          <PrepMode
            soundLibrary={soundLibrary}
            scenes={scenes}
            onScenesChange={setScenes}
          />
        ) : (
          <PlayMode
            scenes={scenes}
            moodLibrary={moodLibrary}
            activeSceneId={activeSceneId}
            activeMood={activeMood}
            onSceneChange={setActiveSceneId}
            onMoodChange={setActiveMood}
          />
        )}
      </main>
    </div>
  )
}
