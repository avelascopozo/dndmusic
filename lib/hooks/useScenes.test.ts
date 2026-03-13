import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

const mockSingle = vi.fn().mockResolvedValue({ data: { id: 'new-id', name: 'Test', emoji: '🗺️', session_active: false, user_id: 'u1', created_at: '' }, error: null })
const mockOrderScenes = vi.fn().mockResolvedValue({ data: [], error: null })
const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })
const mockDeleteEq = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
    from: vi.fn((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: mockOrderScenes,
      insert: vi.fn().mockReturnThis(),
      update: vi.fn(() => ({ eq: mockUpdateEq })),
      delete: vi.fn(() => ({ eq: mockDeleteEq })),
      single: mockSingle,
    })),
  })),
}))

import { useScenes } from './useScenes'

describe('useScenes', () => {
  it('loads scenes on mount', async () => {
    mockOrderScenes.mockResolvedValueOnce({ data: [{ id: '1', name: 'Cave', emoji: '🗡️', session_active: true, user_id: 'u1', created_at: '' }], error: null })
    const { result } = renderHook(() => useScenes())
    await act(async () => {})
    expect(result.current.scenes).toHaveLength(1)
    expect(result.current.scenes[0].name).toBe('Cave')
  })

  it('createScene adds a new scene to state', async () => {
    mockOrderScenes.mockResolvedValueOnce({ data: [], error: null })
    const { result } = renderHook(() => useScenes())
    await act(async () => {})
    await act(async () => {
      await result.current.createScene('Tavern', '🍺')
    })
    expect(result.current.scenes).toHaveLength(1)
    expect(result.current.scenes[0].id).toBe('new-id')
  })

  it('toggleSessionActive updates the scene in state', async () => {
    mockOrderScenes.mockResolvedValueOnce({ data: [{ id: '1', name: 'Cave', emoji: '🗡️', session_active: false, user_id: 'u1', created_at: '' }], error: null })
    const { result } = renderHook(() => useScenes())
    await act(async () => {})
    await act(async () => { await result.current.toggleSessionActive('1', true) })
    expect(result.current.scenes[0].session_active).toBe(true)
  })

  it('deleteScene removes the scene from state', async () => {
    mockOrderScenes.mockResolvedValueOnce({ data: [{ id: '1', name: 'Cave', emoji: '🗡️', session_active: false, user_id: 'u1', created_at: '' }], error: null })
    const { result } = renderHook(() => useScenes())
    await act(async () => {})
    await act(async () => { await result.current.deleteScene('1') })
    expect(result.current.scenes).toHaveLength(0)
  })
})
