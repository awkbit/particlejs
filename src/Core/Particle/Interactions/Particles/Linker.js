import { Circle, ColorUtils, Constants, Utils } from "@utils";
export class Linker {
  constructor(container) {
    this.container = container;
  }
  isEnabled(particle) {
    return particle.particlesOptions.links.enable;
  }
  reset() {}
  interact(p1) {
    const container = this.container;
    const linkOpt1 = p1.particlesOptions.links;
    const optOpacity = linkOpt1.opacity;
    const optDistance = p1.linksDistance ?? container.retina.linksDistance;
    const pos1 = p1.getPosition();
    const range = new Circle(pos1.x, pos1.y, optDistance);
    const query = container.particles.quadTree.query(range);
    for (const p2 of query) {
      const linkOpt2 = p2.particlesOptions.links;
      if (p1 === p2 || !linkOpt2.enable || linkOpt1.id !== linkOpt2.id) {
        continue;
      }
      const pos2 = p2.getPosition();
      let distance = Utils.getDistance(pos1, pos2);

      if (distance > optDistance) {
        return;
      }
      const opacityLine = optOpacity - (distance * optOpacity) / optDistance;
      if (opacityLine > 0) {
        const linksOptions = p1.particlesOptions.links;
        let linkColor =
          linksOptions.id !== undefined
            ? container.particles.linksColors[linksOptions.id]
            : container.particles.linksColor;
        if (!linkColor) {
          const optColor = linksOptions.color;
          const color =
            typeof optColor === "string" ? optColor : optColor.value;
          if (color === Constants.randomColorValue) {
            if (linksOptions.consent) {
              linkColor = ColorUtils.colorToRgb({
                value: color,
              });
            } else if (linksOptions.blink) {
              linkColor = Constants.randomColorValue;
            } else {
              linkColor = Constants.midColorValue;
            }
          } else {
            linkColor = ColorUtils.colorToRgb({
              value: color,
            });
          }
          if (linksOptions.id !== undefined) {
            container.particles.linksColors[linksOptions.id] = linkColor;
          } else {
            container.particles.linksColor = linkColor;
          }
        }
        if (
          p2.links.map((t) => t.destination).indexOf(p1) === -1 &&
          p1.links.map((t) => t.destination).indexOf(p2) === -1
        ) {
          p1.links.push({
            destination: p2,
            opacity: opacityLine,
          });
        }
      }
    }
  }
}
