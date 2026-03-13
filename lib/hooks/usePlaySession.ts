'use client'
import { useState } from 'react'
import type { Mood } from '@/types'

export function usePlaySession() {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null)
  const [activeMood, setActiveMood] = useState<Mood | null>(null)

  function selectScene(sceneId: string | null) {
    setActiveSceneId(sceneId)
  }

  function selectMood(mood: Mood | null) {
    setActiveMood(mood)
  }

  return { activeSceneId, activeMood, selectScene, selectMood }
}
