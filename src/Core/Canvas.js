import { CanvasUtils, ColorUtils, Constants } from "@utils";
export class Canvas {
  constructor(container) {
    this.container = container;
    this.size = {
      height: 0,
      width: 0,
    };
    this.context = null;
    this.generatedCanvas = false;
  }
  init() {
    this.resize();
    const { options } = this.container;

    const { trail } = options.particles.move;

    this.trailFillColor = ColorUtils.colorToRgb(trail.fillColor);
    this.paint();
  }
  loadCanvas(canvas, generatedCanvas) {
    if (!canvas.className) {
      canvas.className = Constants.canvasClass;
    }
    if (this.generatedCanvas) {
      this.element?.remove();
    }
    this.generatedCanvas =
      generatedCanvas !== null && generatedCanvas !== void 0
        ? generatedCanvas
        : false;
    this.element = canvas;
    this.size.height = canvas.offsetHeight;
    this.size.width = canvas.offsetWidth;
    this.context = this.element.getContext("2d");
    this.initBackground();
  }
  destroy() {
    if (this.generatedCanvas) {
      this.element?.remove();
    }
    if (this.context) {
      CanvasUtils.clear(this.context, this.size);
    }
  }
  resize() {
    if (!this.element) {
      return;
    }
    this.element.width = this.size.width;
    this.element.height = this.size.height;
  }
  paint() {
    this.paintBase();
  }
  clear() {
    const { options } = this.container;
    const { trail } = options.particles.move;
    if (trail.enable && trail.length > 0 && this.trailFillColor) {
      this.paintBase(
        ColorUtils.getStyleFromRgb(this.trailFillColor, 1 / trail.length)
      );
    } else if (this.context) {
      CanvasUtils.clear(this.context, this.size);
    }
  }

  drawLinkLine(p1, link) {
    const container = this.container;
    const p2 = link.destination;
    if (container.options.randomLinkColors) {
      this.context.strokeStyle = ColorUtils.getStyleFromRgb(
        ColorUtils.mix(
          p1.linkColor,
          p2.linkColor,
          p1.size.value,
          p2.size.value
        ),
        link.opacity
      );
    }

    const pos1 = p1.getPosition();
    const pos2 = p2.getPosition();
    const ctx = this.context;
    if (!ctx) {
      return;
    }

    const width = p1.linksWidth ?? container.retina.linksWidth;

    CanvasUtils.drawLinkLine(
      ctx,
      width,
      pos1,
      pos2,
      p1.particlesOptions.links.distance,
      container.canvas.size
    );
  }

  drawGrabLine(particle, mousePos) {
    const container = this.container;
    const ctx = container.canvas.context;
    if (!ctx) {
      return;
    }
    const beginPos = particle.getPosition();

    CanvasUtils.drawLine(ctx, beginPos, mousePos);
  }
  drawParticle(particle, delta) {
    const radius = particle.bubble.radius ?? particle.size.value;

    if (!this.context) {
      return;
    }
    if (particle.links.length > 0) {
      this.context.beginPath();
      for (const link of particle.links) {
        this.drawLinkLine(particle, link);
      }
      if (!this.container.options.randomLinkColors) {
        this.context.strokeStyle = ColorUtils.getStyleFromRgb(
          this.container.particles.linksColor,
          particle.links[0].opacity
        );
      }
      this.context.closePath();

      this.context.stroke();
    }
    CanvasUtils.drawParticle(
      this.container,
      this.context,
      particle,
      delta,
      radius
    );
  }
  drawPlugin(plugin, delta) {
    if (!this.context) {
      return;
    }
    CanvasUtils.drawPlugin(this.context, plugin, delta);
  }
  paintBase(baseColor) {
    if (this.context) {
      CanvasUtils.paintBase(this.context, this.size, baseColor);
    }
  }

  initBackground() {
    const options = this.container.options;
    const background = options.background;
    const element = this.element;
    if (!element) {
      return;
    }
    const elementStyle = element.style;
    if (background.color) {
      const color = ColorUtils.colorToRgb(background.color);
      if (color) {
        elementStyle.backgroundColor = ColorUtils.getStyleFromRgb(
          color,
          background.opacity
        );
      }
    }
    if (background.image) {
      elementStyle.backgroundImage = background.image;
    }
    if (background.position) {
      elementStyle.backgroundPosition = background.position;
    }
    if (background.repeat) {
      elementStyle.backgroundRepeat = background.repeat;
    }
    if (background.size) {
      elementStyle.backgroundSize = background.size;
    }
  }
}
