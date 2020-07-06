import { Links } from "./Links/Links"
import { Move } from "./Move"
import { ParticlesNumber } from "./ParticlesNumber"
import { Opacity } from "./Opacity/Opacity"
import { Shape } from "./Shape/Shape"
import { Size } from "./Size/Size"
import { Rotate } from "./Rotate/Rotate"

import { Stroke } from "./Stroke"
import { Collisions } from "./Collisions"
import { Twinkle } from "./Twinkle/Twinkle"
import { AnimatableColor } from "./AnimatableColor"
export class Particles {
  constructor() {
    this.collisions = new Collisions()
    this.color = new AnimatableColor()
    this.links = new Links()
    this.move = new Move()
    this.number = new ParticlesNumber()
    this.opacity = new Opacity()
    this.rotate = new Rotate()

    this.shape = new Shape()
    this.size = new Size()
    this.stroke = new Stroke()
    this.twinkle = new Twinkle()
  }
  get line_linked() {
    return this.links
  }
  set line_linked(value) {
    this.links = value
  }
  get lineLinked() {
    return this.links
  }
  set lineLinked(value) {
    this.links = value
  }
  load(data) {
    if (data === undefined) {
      return
    }
    if (data.color !== undefined) {
      this.color = AnimatableColor.create(this.color, data.color)
    }

    const links = data.links ?? data.lineLinked ?? data.line_linked

    if (links !== undefined) {
      this.links.load(links)
    }
    this.move.load(data.move)
    this.number.load(data.number)
    this.opacity.load(data.opacity)
    this.rotate.load(data.rotate)
    this.shape.load(data.shape)
    this.size.load(data.size)
    this.twinkle.load(data.twinkle)
    const collisions = data.move?.collisions ?? data.move?.bounce

    if (collisions !== undefined) {
      this.collisions.enable = collisions
    }

    this.collisions.load(data.collisions)

    const strokeToLoad = data.stroke ?? data.shape?.stroke

    if (strokeToLoad === undefined) {
      return
    }
    if (strokeToLoad instanceof Array) {
      this.stroke = strokeToLoad.map(s => {
        const tmp = new Stroke()
        tmp.load(s)
        return tmp
      })
    } else {
      if (this.stroke instanceof Array) {
        this.stroke = new Stroke()
      }
      this.stroke.load(strokeToLoad)
    }
  }
}
