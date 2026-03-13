import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

const mockSceneSounds = [
  { id: 'ss1', scene_id: 'sc1', sound_id: 'snd1', autoplay: true, sort_order: 0, sound: { id: 'snd1', name: 'Drip', category: 'cave', type: 'loop', file_url: 'drip.mp3', emoji: '💧' } },
]

const mockDeleteEq = vi.fn().mockResolvedValue({ error: null })
const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } } }) },
    from: vi.fn((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockSceneSounds, error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn(() => ({ eq: mockDeleteEq })),
      update: vi.fn(() => ({ eq: mockUpdateEq })),
    })),
  })),
}))

import { useSceneSounds } from './useSceneSounds'

describe('useSceneSounds', () => {
  it('loads sounds for a scene on mount', async () => {
    const { result } = renderHook(() => useSceneSounds('sc1'))
    await act(async () => {})
    expect(result.current.sounds).toHaveLength(1)
    expect(result.current.sounds[0].sound.name).toBe('Drip')
  })

  it('removeSound removes the sound from state', async () => {
    const { result } = renderHook(() => useSceneSounds('sc1'))
    await act(async () => {})
    await act(async () => { await result.current.removeSound('ss1') })
    expect(result.current.sounds).toHaveLength(0)
  })

  it('updateAutoplay updates autoplay flag in state', async () => {
    const { result } = renderHook(() => useSceneSounds('sc1'))
    await act(async () => {})
    await act(async () => { await result.current.updateAutoplay('ss1', false) })
    expect(result.current.sounds[0].autoplay).toBe(false)
  })

  it('returns empty sounds when sceneId is null', async () => {
    const { result } = renderHook(() => useSceneSounds(null))
    await act(async () => {})
    expect(result.current.sounds).toHaveLength(0)
  })
})
