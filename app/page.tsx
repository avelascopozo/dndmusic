import { createClient } from '@/lib/supabase/server'
import AppShell from './components/AppShell'
import { SoundLibraryItem, MoodLibraryItem } from '@/types'

export default async function Home() {
  const supabase = await createClient()

  const [{ data: sounds }, { data: moods }] = await Promise.all([
    supabase.from('sound_library').select('*').order('category').order('name'),
    supabase.from('mood_library').select('*').order('mood').order('name'),
  ])

  return (
    <AppShell
      soundLibrary={(sounds ?? []) as SoundLibraryItem[]}
      moodLibrary={(moods ?? []) as MoodLibraryItem[]}
    />
  )
}
