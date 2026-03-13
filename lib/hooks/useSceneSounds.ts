'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SceneSound, SoundLibraryItem } from '@/types'

export function useSceneSounds(sceneId: string | null) {
  const [sounds, setSounds] = useState<SceneSound[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!sceneId) { setSounds([]); return }
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('scene_sounds')
      .select('*, sound:sound_library(*)')
      .eq('scene_id', sceneId)
      .order('sort_order', { ascending: true })
    setSounds((data as SceneSound[]) ?? [])
    setLoading(false)
  }, [sceneId])

  useEffect(() => { load() }, [load])

  async function addSound(sound: SoundLibraryItem): Promise<void> {
    if (!sceneId) return
    if (sounds.some(s => s.sound_id === sound.id)) return
    const supabase = createClient()
    await supabase.from('scene_sounds').insert({
      scene_id: sceneId,
      sound_id: sound.id,
      autoplay: false,
      sort_order: sounds.length,
    })
    await load()
  }

  async function removeSound(sceneSoundId: string) {
    const supabase = createClient()
    await supabase.from('scene_sounds').delete().eq('id', sceneSoundId)
    setSounds(prev => prev.filter(s => s.id !== sceneSoundId))
  }

  async function updateAutoplay(sceneSoundId: string, autoplay: boolean) {
    const supabase = createClient()
    await supabase.from('scene_sounds').update({ autoplay }).eq('id', sceneSoundId)
    setSounds(prev => prev.map(s => s.id === sceneSoundId ? { ...s, autoplay } : s))
  }

  return { sounds, loading, addSound, removeSound, updateAutoplay }
}
