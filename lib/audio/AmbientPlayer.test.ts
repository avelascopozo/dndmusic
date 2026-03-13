// lib/audio/AmbientPlayer.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Howl } from 'howler'
import { AmbientPlayer } from './AmbientPlayer'
import type { SceneSound } from '@/types'

vi.mock('howler', () => {
  const instances: any[] = []
  const MockHowl = vi.fn().mockImplementation(function (this: any) {
    this.play = vi.fn()
    this.stop = vi.fn()
    this.fade = vi.fn()
    this.volume = vi.fn().mockReturnValue(1)
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

const makeSound = (id: string, autoplay: boolean, type: 'loop' | 'one-shot'): SceneSound => ({
  id,
  scene_id: 'scene-1',
  sound_id: id,
  autoplay,
  sort_order: 0,
  sound: { id, name: `Sound ${id}`, category: 'cave', type, file_url: `${id}.mp3`, emoji: '🔊' },
})

describe('AmbientPlayer', () => {
  let player: AmbientPlayer

  beforeEach(() => {
    player = new AmbientPlayer()
    vi.clearAllMocks()
    getInstances().length = 0
  })

  it('starts autoplay loop sounds when loading a scene', () => {
    const sounds = [makeSound('s1', true, 'loop'), makeSound('s2', false, 'loop')]
    player.loadScene(sounds)
    const instances = getInstances()
    expect(instances[0].play).toHaveBeenCalled()
    expect(instances[1].play).not.toHaveBeenCalled()
  })

  it('fires autoplay one-shot and does not loop it', () => {
    const sounds = [makeSound('s1', true, 'one-shot')]
    player.loadScene(sounds)
    expect(Howl).toHaveBeenCalledWith(expect.objectContaining({ loop: false }))
    const instance = getInstances()[0]
    expect(instance.play).toHaveBeenCalled()
  })

  it('toggles a loop sound on and off', () => {
    const sounds = [makeSound('s1', false, 'loop')]
    player.loadScene(sounds)
    const instance = getInstances()[0]
    instance.playing.mockReturnValue(false)
    player.toggleSound('s1')
    expect(instance.play).toHaveBeenCalled()
    instance.playing.mockReturnValue(true)
    player.toggleSound('s1')
    expect(instance.stop).toHaveBeenCalled()
  })

  it('unloads all sounds on scene change', () => {
    const sounds = [makeSound('s1', false, 'loop')]
    player.loadScene(sounds)
    const instance = getInstances()[0]
    player.unloadAll()
    expect(instance.unload).toHaveBeenCalled()
  })

  it('triggerOneShot stops then replays the sound', () => {
    const sounds = [makeSound('s1', false, 'one-shot')]
    player.loadScene(sounds)
    const instance = getInstances()[0]
    player.triggerOneShot('s1')
    expect(instance.stop).toHaveBeenCalled()
    expect(instance.play).toHaveBeenCalled()
  })

  it('isPlaying returns true when sound is playing', () => {
    const sounds = [makeSound('s1', false, 'loop')]
    player.loadScene(sounds)
    const instance = getInstances()[0]
    instance.playing.mockReturnValue(true)
    expect(player.isPlaying('s1')).toBe(true)
    instance.playing.mockReturnValue(false)
    expect(player.isPlaying('s1')).toBe(false)
  })

  it('isPlaying returns false for unknown soundId', () => {
    player.loadScene([])
    expect(player.isPlaying('nonexistent')).toBe(false)
  })
})
