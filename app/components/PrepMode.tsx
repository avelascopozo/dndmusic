'use client'

import { useState } from 'react'
import { SoundLibraryItem } from '@/types'
import { LocalScene } from './AppShell'

const SCENE_EMOJIS = ['🗺️', '🗡️', '🏰', '🍺', '🌲', '🏔️', '⚓', '🏛️', '🔥', '☠️']

interface Props {
  soundLibrary: SoundLibraryItem[]
  scenes: LocalScene[]
  onScenesChange: (scenes: LocalScene[]) => void
}

export default function PrepMode({ soundLibrary, scenes, onScenesChange }: Props) {
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(
    scenes[0]?.id ?? null
  )
  const [showSoundPicker, setShowSoundPicker] = useState(false)
  const [newSceneName, setNewSceneName] = useState('')
  const [soundFilter, setSoundFilter] = useState<string>('all')

  const selectedScene = scenes.find(s => s.id === selectedSceneId)

  function createScene() {
    if (!newSceneName.trim()) return
    const scene: LocalScene = {
      id: crypto.randomUUID(),
      name: newSceneName.trim(),
      emoji: SCENE_EMOJIS[scenes.length % SCENE_EMOJIS.length],
      sounds: [],
    }
    const updated = [...scenes, scene]
    onScenesChange(updated)
    setSelectedSceneId(scene.id)
    setNewSceneName('')
  }

  function deleteScene(id: string) {
    const updated = scenes.filter(s => s.id !== id)
    onScenesChange(updated)
    if (selectedSceneId === id) setSelectedSceneId(updated[0]?.id ?? null)
  }

  function addSoundToScene(sound: SoundLibraryItem) {
    if (!selectedScene) return
    if (selectedScene.sounds.find(s => s.id === sound.id)) return
    const updated = scenes.map(s =>
      s.id === selectedScene.id
        ? { ...s, sounds: [...s.sounds, { ...sound, autoplay: false }] }
        : s
    )
    onScenesChange(updated)
  }

  function removeSoundFromScene(soundId: string) {
    if (!selectedScene) return
    const updated = scenes.map(s =>
      s.id === selectedScene.id
        ? { ...s, sounds: s.sounds.filter(snd => snd.id !== soundId) }
        : s
    )
    onScenesChange(updated)
  }

  function toggleAutoplay(soundId: string) {
    if (!selectedScene) return
    const updated = scenes.map(s =>
      s.id === selectedScene.id
        ? {
            ...s,
            sounds: s.sounds.map(snd =>
              snd.id === soundId ? { ...snd, autoplay: !snd.autoplay } : snd
            ),
          }
        : s
    )
    onScenesChange(updated)
  }

  const categories = ['all', ...Array.from(new Set(soundLibrary.map(s => s.category)))]
  const filteredSounds = soundFilter === 'all'
    ? soundLibrary
    : soundLibrary.filter(s => s.category === soundFilter)

  const sceneHasSound = (soundId: string) =>
    selectedScene?.sounds.some(s => s.id === soundId) ?? false

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Sidebar — Escenas */}
      <aside className="w-64 border-r border-stone-800 flex flex-col bg-stone-950">
        <div className="p-4 border-b border-stone-800">
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-display">
            Mis escenas
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSceneName}
              onChange={e => setNewSceneName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createScene()}
              placeholder="Nueva escena..."
              className="flex-1 bg-stone-800 text-stone-200 text-sm rounded px-3 py-2 border border-stone-700 placeholder-stone-600 focus:outline-none focus:border-amber-600 min-w-0"
            />
            <button
              onClick={createScene}
              disabled={!newSceneName.trim()}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 rounded text-sm font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {scenes.length === 0 && (
            <p className="text-stone-600 text-sm text-center mt-8 px-4">
              Crea tu primera escena para empezar
            </p>
          )}
          {scenes.map(scene => (
            <button
              key={scene.id}
              onClick={() => setSelectedSceneId(scene.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 flex items-center gap-2 group transition-colors ${
                selectedSceneId === scene.id
                  ? 'bg-amber-600/20 border border-amber-600/50 text-amber-300'
                  : 'hover:bg-stone-800 text-stone-300 border border-transparent'
              }`}
            >
              <span className="text-lg">{scene.emoji}</span>
              <span className="flex-1 text-sm font-medium truncate">{scene.name}</span>
              <span className="text-xs text-stone-500">{scene.sounds.length}</span>
              <button
                onClick={e => { e.stopPropagation(); deleteScene(scene.id) }}
                className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-red-400 text-xs transition-opacity"
              >
                ✕
              </button>
            </button>
          ))}
        </div>
      </aside>

      {/* Panel principal — Sonidos de la escena */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedScene ? (
          <div className="flex-1 flex items-center justify-center text-stone-600">
            <div className="text-center">
              <p className="text-4xl mb-4">🗺️</p>
              <p className="font-display text-lg">Selecciona o crea una escena</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header escena */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedScene.emoji}</span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-stone-100">
                    {selectedScene.name}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {selectedScene.sounds.length} sonido{selectedScene.sounds.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSoundPicker(true)}
                className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-600/50 text-stone-200 rounded-lg text-sm transition-colors"
              >
                + Añadir sonido
              </button>
            </div>

            {/* Lista de sonidos */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedScene.sounds.length === 0 ? (
                <div className="text-center text-stone-600 mt-16">
                  <p className="text-3xl mb-3">🔇</p>
                  <p>Sin sonidos aún. Añade sonidos de la biblioteca.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs uppercase tracking-widest text-stone-500 font-display border-b border-stone-800">
                    <span>Sonido</span>
                    <span>Tipo</span>
                    <span>Autoplay</span>
                    <span></span>
                  </div>
                  {selectedScene.sounds.map(sound => (
                    <div
                      key={sound.id}
                      className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 bg-stone-900 rounded-lg border border-stone-800 hover:border-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{sound.emoji}</span>
                        <span className="text-stone-200 text-sm">{sound.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        sound.type === 'loop'
                          ? 'bg-blue-900/50 text-blue-300 border border-blue-800'
                          : 'bg-purple-900/50 text-purple-300 border border-purple-800'
                      }`}>
                        {sound.type === 'loop' ? '🔄 Loop' : '⚡ One-shot'}
                      </span>
                      <button
                        onClick={() => toggleAutoplay(sound.id)}
                        disabled={sound.type === 'one-shot'}
                        className={`w-10 h-6 rounded-full transition-colors relative ${
                          sound.autoplay && sound.type === 'loop'
                            ? 'bg-amber-500'
                            : 'bg-stone-700'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                        title={sound.type === 'one-shot' ? 'Los one-shots no tienen autoplay' : ''}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          sound.autoplay && sound.type === 'loop' ? 'left-4' : 'left-0.5'
                        }`} />
                      </button>
                      <button
                        onClick={() => removeSoundFromScene(sound.id)}
                        className="text-stone-600 hover:text-red-400 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal — Biblioteca de sonidos */}
      {showSoundPicker && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowSoundPicker(false)}
        >
          <div
            className="bg-stone-900 border border-stone-700 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-stone-100">
                Biblioteca de sonidos
              </h3>
              <button
                onClick={() => setShowSoundPicker(false)}
                className="text-stone-500 hover:text-stone-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filtro por categoría */}
            <div className="px-6 py-3 border-b border-stone-800 flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSoundFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                    soundFilter === cat
                      ? 'bg-amber-600 text-stone-950 font-semibold'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {filteredSounds.map(sound => {
                const inScene = sceneHasSound(sound.id)
                return (
                  <button
                    key={sound.id}
                    onClick={() => !inScene && addSoundToScene(sound)}
                    disabled={inScene}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      inScene
                        ? 'opacity-40 cursor-not-allowed bg-stone-800/50'
                        : 'hover:bg-stone-800 border border-transparent hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xl">{sound.emoji}</span>
                    <span className="flex-1 text-sm text-stone-200">{sound.name}</span>
                    <span className="text-xs text-stone-500 capitalize">{sound.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      sound.type === 'loop'
                        ? 'bg-blue-900/50 text-blue-400'
                        : 'bg-purple-900/50 text-purple-400'
                    }`}>
                      {sound.type}
                    </span>
                    {inScene && <span className="text-xs text-amber-500">✓ Añadido</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
