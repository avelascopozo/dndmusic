import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePlaySession } from './usePlaySession'

describe('usePlaySession', () => {
  it('starts with no active scene or mood', () => {
    const { result } = renderHook(() => usePlaySession())
    expect(result.current.activeSceneId).toBeNull()
    expect(result.current.activeMood).toBeNull()
  })

  it('selectScene updates activeSceneId', () => {
    const { result } = renderHook(() => usePlaySession())
    act(() => { result.current.selectScene('scene-42') })
    expect(result.current.activeSceneId).toBe('scene-42')
  })

  it('selectMood updates activeMood', () => {
    const { result } = renderHook(() => usePlaySession())
    act(() => { result.current.selectMood('combat') })
    expect(result.current.activeMood).toBe('combat')
  })

  it('selectScene and selectMood are independent', () => {
    const { result } = renderHook(() => usePlaySession())
    act(() => { result.current.selectScene('scene-1') })
    act(() => { result.current.selectMood('mystery') })
    expect(result.current.activeSceneId).toBe('scene-1')
    expect(result.current.activeMood).toBe('mystery')
  })
})
