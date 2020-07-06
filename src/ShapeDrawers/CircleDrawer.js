function _(num) {
  return (0.5 + num) | 0
}

export class CircleDrawer {
  draw(context, particle, radius) {
    const { x, y } = particle.getPosition()

    context.arc(_(x), _(y), radius, 0, Math.PI * 2, false)
  }
}
