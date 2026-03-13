// lib/audio/MusicPlayer.ts
import { Howl } from 'howler'
import { AudioEngine } from './AudioEngine'

const CROSSFADE_MS = 2000
const MUSIC_VOLUME = 0.8

export class MusicPlayer {
  private current: Howl | null = null

  playMood(fileUrl: string) {
    const previous = this.current
    const next = AudioEngine.createHowl({ src: fileUrl, loop: true, volume: 0 })
    this.current = next

    if (previous && previous.playing()) {
      AudioEngine.fadeOut(previous, CROSSFADE_MS).then(() => previous.unload())
    }

    AudioEngine.fadeIn(next, MUSIC_VOLUME, CROSSFADE_MS)
  }

  stop() {
    if (this.current) {
      this.current.stop()
      this.current.unload()
      this.current = null
    }
  }

  isPlaying(): boolean {
    return this.current?.playing() ?? false
  }
}
