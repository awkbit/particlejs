import { Utils } from "@utils";
import { HoverMode } from "@enums";
export class Mover {
  constructor(container, particle) {
    this.container = container;
    this.particle = particle;
  }
  move(delta) {
    this.moveParticle(delta);
    this.moveParallax();
  }
  moveParticle(delta) {
    var _a;
    const particle = this.particle;
    const particlesOptions = particle.particlesOptions;
    if (!particlesOptions.move.enable) {
      return;
    }
    const container = this.container;
    const options = container.options;
    const slowFactor = this.getProximitySpeedFactor();
    const deltaFactor = options.fpsLimit > 0 ? (60 * delta) / 1000 : 3.6;
    const baseSpeed =
      (_a = particle.moveSpeed) !== null && _a !== void 0
        ? _a
        : container.retina.moveSpeed;
    const moveSpeed = (baseSpeed / 2) * slowFactor * deltaFactor;
    this.applyNoise(delta);
    particle.position.x += particle.velocity.horizontal * moveSpeed;
    particle.position.y += particle.velocity.vertical * moveSpeed;
    if (particlesOptions.move.vibrate) {
      particle.position.x += Math.sin(
        particle.position.x * Math.cos(particle.position.y)
      );
      particle.position.y += Math.cos(
        particle.position.y * Math.sin(particle.position.x)
      );
    }
  }
  applyNoise(delta) {
    const particle = this.particle;
    const particlesOptions = particle.particlesOptions;
    const noiseOptions = particlesOptions.move.noise;
    const noiseEnabled = noiseOptions.enable;
    if (!noiseEnabled) {
      return;
    }
    if (particle.lastNoiseTime <= particle.noiseDelay) {
      particle.lastNoiseTime += delta;
      return;
    }
    const noise = {
      angle: Math.random() * Math.PI * 2,
      length: Math.random(),
    };
    particle.velocity.horizontal += Math.cos(noise.angle) * noise.length;
    particle.velocity.horizontal = Utils.clamp(
      particle.velocity.horizontal,
      -1,
      1
    );
    particle.velocity.vertical += Math.sin(noise.angle) * noise.length;
    particle.velocity.vertical = Utils.clamp(particle.velocity.vertical, -1, 1);
    particle.lastNoiseTime -= particle.noiseDelay;
  }
  moveParallax() {
    const container = this.container;
    const { options } = container;
    const mousePos = container.interactivity.mouse.position;
    if (!options.interactivity.events.onHover.parallax.enable || !mousePos) {
      return;
    }
    const particle = this.particle;
    const { force, smooth } = options.interactivity.events.onHover.parallax;

    const windowDimension = {
      height: window.innerHeight / 2,
      width: window.innerWidth / 2,
    };
    const tmp = {
      x: (mousePos.x - windowDimension.width) * (particle.size.value / force),
      y: (mousePos.y - windowDimension.height) * (particle.size.value / force),
    };
    particle.offset.x += (tmp.x - particle.offset.x) / smooth;
    particle.offset.y += (tmp.y - particle.offset.y) / smooth;
  }
  getProximitySpeedFactor() {
    const container = this.container;
    const options = container.options;
    const active = Utils.isInArray(
      HoverMode.slow,
      options.interactivity.events.onHover.mode
    );
    const mousePos = this.container.interactivity.mouse.position;
    if (!active || !mousePos) {
      return 1;
    }

    const particlePos = this.particle.getPosition();
    const dist = Utils.getDistance(mousePos, particlePos);
    const radius = container.retina.slowModeRadius;
    if (dist > radius) {
      return 1;
    }
    const proximityFactor = dist / radius || 0;
    const slowFactor = options.interactivity.modes.slow.factor;
    return proximityFactor / slowFactor;
  }
}
