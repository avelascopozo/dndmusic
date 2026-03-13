// lib/audio/AmbientPlayer.ts
import { Howl } from 'howler'
import { AudioEngine } from './AudioEngine'
import type { SceneSound } from '@/types'

export class AmbientPlayer {
  private howls: Map<string, Howl> = new Map()

  loadScene(sounds: SceneSound[]) {
    this.unloadAll()
    for (const s of sounds) {
      const isLoop = s.sound.type === 'loop'
      const howl = AudioEngine.createHowl({
        src: s.sound.file_url,
        loop: isLoop,
        volume: 0.7,
      })
      this.howls.set(s.sound_id, howl)
      if (s.autoplay) howl.play()
    }
  }

  toggleSound(soundId: string) {
    const howl = this.howls.get(soundId)
    if (!howl) return
    if (howl.playing()) {
      howl.stop()
    } else {
      howl.play()
    }
  }

  triggerOneShot(soundId: string) {
    const howl = this.howls.get(soundId)
    if (!howl) return
    howl.stop()
    howl.play()
  }

  isPlaying(soundId: string): boolean {
    return this.howls.get(soundId)?.playing() ?? false
  }

  unloadAll() {
    this.howls.forEach(h => h.unload())
    this.howls.clear()
  }
}
