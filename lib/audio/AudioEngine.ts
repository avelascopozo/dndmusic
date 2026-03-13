// lib/audio/AudioEngine.ts
import { Howl, Howler } from 'howler'

export interface HowlConfig {
  src: string
  loop: boolean
  volume?: number
  onend?: () => void
}

export class AudioEngine {
  static createHowl(config: HowlConfig): Howl {
    return new Howl({
      src: [config.src],
      loop: config.loop,
      volume: config.volume ?? 1.0,
      onend: config.onend,
      html5: true, // avoids CORS issues with external audio URLs
    })
  }

  static setGlobalVolume(volume: number) {
    Howler.volume(volume)
  }

  static fadeOut(howl: Howl, durationMs: number): Promise<void> {
    return new Promise(resolve => {
      const vol = typeof howl.volume() === 'number' ? (howl.volume() as number) : 1.0
      howl.fade(vol, 0, durationMs)
      setTimeout(resolve, durationMs)
    })
  }

  static fadeIn(howl: Howl, targetVolume: number, durationMs: number) {
    howl.volume(0)
    howl.play()
    howl.fade(0, targetVolume, durationMs)
  }
}
