export type SoundType = 'loop' | 'one-shot'
export type Mood = 'calm' | 'mystery' | 'tension' | 'combat' | 'victory' | 'sadness'

export interface SoundLibraryItem {
  id: string
  name: string
  category: string
  type: SoundType
  file_url: string
  emoji: string
}

export interface MoodLibraryItem {
  id: string
  mood: Mood
  name: string
  file_url: string
}

export interface Scene {
  id: string
  user_id: string
  name: string
  emoji: string
  session_active: boolean
  created_at: string
}

export interface SceneSound {
  id: string
  scene_id: string
  sound_id: string
  autoplay: boolean
  sort_order: number
  sound: SoundLibraryItem  // joined
}

export interface SessionMood {
  id: string
  user_id: string
  mood: Mood
  session_active: boolean
}
