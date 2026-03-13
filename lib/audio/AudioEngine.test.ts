// lib/audio/AudioEngine.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Howl, Howler } from 'howler'
import { AudioEngine } from './AudioEngine'

vi.mock('howler', () => {
  const instances: any[] = []
  const MockHowl = vi.fn().mockImplementation(function (this: any) {
    this.play = vi.fn()
    this.stop = vi.fn()
    this.fade = vi.fn()
    this.loop = vi.fn()
    this.volume = vi.fn().mockReturnValue(0.8)
    this.playing = vi.fn().mockReturnValue(false)
    this.unload = vi.fn()
    instances.push(this)
  }) as any
  MockHowl._instances = instances
  return {
    Howl: MockHowl,
    Howler: { volume: vi.fn() },
  }
})

function getInstances(): any[] {
  return (Howl as any)._instances
}

describe('AudioEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getInstances().length = 0
  })

  it('creates a Howl instance with correct config for a loop sound', () => {
    AudioEngine.createHowl({ src: 'test.mp3', loop: true, volume: 0.8 })
    expect(Howl).toHaveBeenCalledWith(
      expect.objectContaining({ src: ['test.mp3'], loop: true, volume: 0.8 })
    )
  })

  it('creates a Howl instance for a one-shot sound', () => {
    AudioEngine.createHowl({ src: 'bang.mp3', loop: false, volume: 1.0 })
    expect(Howl).toHaveBeenCalledWith(
      expect.objectContaining({ src: ['bang.mp3'], loop: false })
    )
  })

  it('fadeOut calls howl.fade from current volume to 0', async () => {
    vi.useFakeTimers()
    const howl = new Howl({ src: ['x.mp3'], loop: false } as any)
    const instance = getInstances()[0]
    instance.volume.mockReturnValue(0.8)
    const promise = AudioEngine.fadeOut(howl as any, 1000)
    expect(instance.fade).toHaveBeenCalledWith(0.8, 0, 1000)
    vi.advanceTimersByTime(1000)
    await promise
    vi.useRealTimers()
  })

  it('fadeIn sets volume to 0, plays, then fades to target', () => {
    const howl = new Howl({ src: ['x.mp3'], loop: true } as any)
    const instance = getInstances()[0]
    AudioEngine.fadeIn(howl as any, 0.7, 1500)
    expect(instance.volume).toHaveBeenCalledWith(0)
    expect(instance.play).toHaveBeenCalled()
    expect(instance.fade).toHaveBeenCalledWith(0, 0.7, 1500)
  })
})
