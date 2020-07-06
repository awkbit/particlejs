import { Interactivity } from "./Interactivity/Interactivity"
import { Particles } from "./Particles/Particles"

import { Background } from "./Background/Background"

import { Plugins } from "@utils"
export class Options {
  constructor() {
    this.background = new Background()

    this.detectRetina = true
    this.fpsLimit = 30

    this.interactivity = new Interactivity()
    this.particles = new Particles()
    this.pauseOnBlur = true
    this.randomLinkColors = false
  }

  load(data) {
    if (data === undefined) {
      return
    }
    if (data.preset !== undefined) {
      if (data.preset instanceof Array) {
        for (const preset of data.preset) {
          this.importPreset(preset)
        }
      } else {
        this.importPreset(data.preset)
      }
    }
    const detectRetina = data.detectRetina

    if (detectRetina !== undefined) {
      this.detectRetina = detectRetina
    }
    if (data.randomLinkColors !== undefined) {
      this.randomLinkColors = data.randomLinkColors
    }

    const fpsLimit = data.fpsLimit

    if (fpsLimit !== undefined) {
      this.fpsLimit = fpsLimit
    }
    if (data.pauseOnBlur !== undefined) {
      this.pauseOnBlur = data.pauseOnBlur
    }
    this.background.load(data.background)
    this.particles.load(data.particles)

    this.interactivity.load(data.interactivity)

    Plugins.loadOptions(this, data)
  }
  importPreset(preset) {
    this.load(Plugins.getPreset(preset))
  }
}
