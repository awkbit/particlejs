import { Particle } from "./Particle";
import { QuadTree, Rectangle, ColorUtils } from "@utils";
import { InteractionManager } from "./Particle/InteractionManager";

// TODO use linked list for particles
export class Particles {
  constructor(container) {
    this.container = container;
    this.array = [];
    this.interactionManager = new InteractionManager(container);

    this.linksColors = {};
    this.quadTree = null;
  }
  get count() {
    return this.array.length;
  }
  init() {
    const { color, opacity, number } = this.container.options.particles;

    const canvasSize = this.container.canvas.size;
    this.quadTree = new QuadTree(
      new Rectangle(0, 0, canvasSize.width, canvasSize.height),
      4
    );
    this.particlesFillStyle = ColorUtils.getStyleFromRgb(
      ColorUtils.colorToRgb(color.value),
      opacity.value
    );

    for (let i = this.count; i < number.value; i++) {
      this.addParticle();
    }

    this.interactionManager.init();
  }
  redraw() {
    this.clear();
    this.init();
    this.draw(0);
  }
  removeAt(index, quantity) {
    if (index >= 0 && index <= this.count) {
      for (const particle of this.array.splice(
        index,
        quantity !== null && quantity !== void 0 ? quantity : 1
      )) {
        particle.destroy();
      }
    }
  }
  remove(particle) {
    this.removeAt(this.array.indexOf(particle));
  }
  update(delta) {
    const container = this.container;
    const particlesToDelete = [];
    for (const particle of this.array) {
      particle.bubble.inRange = false;
      for (const [, plugin] of container.plugins) {
        if (particle.destroyed) {
          break;
        }
        if (plugin.particleUpdate) {
          plugin.particleUpdate(particle, delta);
        }
      }
      if (!particle.destroyed) {
        particle.update(delta);
      } else {
        particlesToDelete.push(particle);
        continue;
      }
      this.quadTree.insert(particle);
    }
    for (const particle of particlesToDelete) {
      this.remove(particle);
    }
    this.interactionManager.interact(delta);
  }
  draw(delta) {
    const container = this.container;
    container.canvas.clear();

    this.quadTree.reset();
    this.update(delta);

    const { context } = container.canvas;
    context.fillStyle = this.particlesFillStyle;
    for (const p of this.array) {
      context.beginPath();
      p.draw(delta);

      context.fill();
    }
  }
  clear() {
    this.array.length = 0;
  }
  push(nb, mousePosition) {
    const container = this.container;
    const options = container.options;
    const limit = options.particles.number.limit * container.density;
    this.pushing = true;
    if (limit > 0) {
      const countToRemove = this.count + nb - limit;
      if (countToRemove > 0) {
        this.removeQuantity(countToRemove);
      }
    }
    const pos = mousePosition && (mousePosition.position ?? { x: 0, y: 0 });

    for (let i = 0; i < nb; i++) {
      this.addParticle(pos);
    }
    if (!options.particles.move.enable) {
      this.container.play();
    }
    this.pushing = false;
  }
  addParticle(position) {
    // TODO: use Linked List and create a Pool of removed Particles
    // Check if Pool has a Particle available and unshift one from the Pool
    const particle = new Particle(this.container, position);
    this.array.push(particle);
    return particle;
  }
  removeQuantity(quantity) {
    const options = this.container.options;
    this.removeAt(0, quantity);
    if (!options.particles.move.enable) {
      this.container.play();
    }
  }
}
