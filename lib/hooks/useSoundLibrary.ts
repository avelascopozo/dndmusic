'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SoundLibraryItem } from '@/types'

export function useSoundLibrary() {
  const [sounds, setSounds] = useState<SoundLibraryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('sound_library')
        .select('*')
        .order('category')
        .order('name')
      setSounds(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return { sounds, loading }
}
