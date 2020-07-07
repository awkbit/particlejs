import { Constants, Utils, Circle, ColorUtils } from "@utils";
import { HoverMode } from "@enums/Modes";
export class Grabber {
  constructor(container) {
    this.container = container;
  }
  isEnabled() {
    const container = this.container;
    const mouse = container.interactivity.mouse;
    const events = container.options.interactivity.events;
    if (!(events.onHover.enable && mouse.position)) {
      return false;
    }
    const hoverMode = events.onHover.mode;
    return Utils.isInArray(HoverMode.grab, hoverMode);
  }
  reset() {}
  interact() {
    const container = this.container;
    const options = container.options;
    const interactivity = options.interactivity;
    if (
      interactivity.events.onHover.enable &&
      container.interactivity.status === Constants.mouseMoveEvent
    ) {
      const mousePos = container.interactivity.mouse.position;
      if (mousePos === undefined) {
        return;
      }
      const distance = container.retina.grabModeDistance;
      const query = container.particles.quadTree.query(
        new Circle(mousePos.x, mousePos.y, distance)
      );
      const { context } = container.canvas;
      const grabLineOptions = interactivity.modes.grab.links;
      const lineOpacity = grabLineOptions.opacity;
      const grabDistance = container.retina.grabModeDistance;
      const optColor = ColorUtils.colorToRgb(
        container.options.particles.links.color
      );
      context.lineWidth = container.retina.linksWidth;

      for (const particle of query) {
        const pos = particle.getPosition();
        const distance = Utils.getDistance(pos, mousePos);
        if (distance <= container.retina.grabModeDistance) {
          const opacityLine =
            lineOpacity - (distance * lineOpacity) / grabDistance;

          if (opacityLine > 0) {
            context.beginPath();
            container.canvas.drawGrabLine(particle, mousePos);
            context.closePath();
            context.strokeStyle = ColorUtils.getStyleFromRgb(
              optColor,
              opacityLine.toFixed(2)
            );

            context.stroke();
          }
        }
      }
    }
  }
}
