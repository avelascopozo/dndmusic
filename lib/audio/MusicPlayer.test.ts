// lib/audio/MusicPlayer.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Howl } from 'howler'
import { MusicPlayer } from './MusicPlayer'

vi.mock('howler', () => {
  const instances: any[] = []
  const MockHowl = vi.fn().mockImplementation(function (this: any) {
    this.play = vi.fn()
    this.stop = vi.fn()
    this.fade = vi.fn()
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

describe('MusicPlayer', () => {
  let player: MusicPlayer

  beforeEach(() => {
    player = new MusicPlayer()
    vi.clearAllMocks()
    getInstances().length = 0
  })

  it('plays a track when no previous track is active', () => {
    player.playMood('test.mp3')
    const instance = getInstances()[0]
    expect(instance.play).toHaveBeenCalled()
  })

  it('fades out current track and starts new one on mood change', async () => {
    vi.useFakeTimers()
    player.playMood('track1.mp3')
    const firstInstance = getInstances()[0]
    firstInstance.playing.mockReturnValue(true)
    player.playMood('track2.mp3')
    expect(firstInstance.fade).toHaveBeenCalled()
    const secondInstance = getInstances()[1]
    expect(secondInstance.play).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('stops and unloads current track when stop() is called', () => {
    player.playMood('track.mp3')
    const instance = getInstances()[0]
    player.stop()
    expect(instance.stop).toHaveBeenCalled()
    expect(instance.unload).toHaveBeenCalled()
  })
})
