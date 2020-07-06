import { Utils } from "./Utils"

function _(num) {
  return (0.5 + num) | 0
}

export class CanvasUtils {
  static paintBase(context, dimension, baseColor) {
    context.fillStyle =
      baseColor !== null && baseColor !== void 0 ? baseColor : "rgba(0,0,0,0)"
    context.fillRect(0, 0, _(dimension.width), _(dimension.height))
  }
  static clear(context, dimension) {
    context.clearRect(0, 0, _(dimension.width), _(dimension.height))
  }
  static drawLinkLine(context, width, begin, end, maxDistance) {

    if (Utils.getDistance(begin, end) <= maxDistance) {
      this.drawLine(context, begin, end)
      context.lineWidth = _(width)
    }
    
  }

  static drawGrabLine(context, begin, end) {
    this.drawLine(context, begin, end)
  }
  static drawParticle(container, context, particle, delta, radius, opacity) {
    this.drawShape(container, context, particle, radius, opacity, delta)
  }
  static drawShape(container, context, particle, radius, opacity, delta) {
    const drawer = container.drawers.get(particle.shape)

    drawer.draw(context, particle, radius.toFixed(2), opacity, _(delta))
  }

  static drawLine(context, begin, end) {
    context.moveTo(_(begin.x), _(begin.y))
    context.lineTo(_(end.x), _(end.y))
  }
}
