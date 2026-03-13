'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Scene } from '@/types'

export function useScenes() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('scenes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    setScenes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function createScene(name: string, emoji: string): Promise<Scene | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase
      .from('scenes')
      .insert({ name, emoji, user_id: user.id })
      .select()
      .single()
    if (data) setScenes(prev => [...prev, data])
    return data
  }

  async function toggleSessionActive(sceneId: string, active: boolean) {
    const supabase = createClient()
    await supabase.from('scenes').update({ session_active: active }).eq('id', sceneId)
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, session_active: active } : s))
  }

  async function deleteScene(sceneId: string) {
    const supabase = createClient()
    await supabase.from('scenes').delete().eq('id', sceneId)
    setScenes(prev => prev.filter(s => s.id !== sceneId))
  }

  return { scenes, loading, createScene, toggleSessionActive, deleteScene, reload: load }
}
