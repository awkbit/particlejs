import { Grabber } from "./Interactions/Mouse/Grabber";
import { Linker } from "./Interactions/Particles/Linker";

export class InteractionManager {
  constructor(container) {
    this.container = container;
    this.externalInteractors = [new Grabber(container)];
    this.particleInteractors = [new Linker(container)];
  }
  init() {}
  interact(delta) {
    this.externalInteract(delta);
    this.particlesInteract(delta);
  }
  externalInteract(delta) {
    for (const interactor of this.externalInteractors) {
      if (interactor.isEnabled()) {
        interactor.interact(delta);
      }
    }
  }
  particlesInteract(delta) {
    for (const particle of this.container.particles.pList) {
      for (const interactor of this.externalInteractors) {
        interactor.reset(particle);
      }
      for (const interactor of this.particleInteractors) {
        if (interactor.isEnabled(particle)) {
          interactor.interact(particle, delta);
        }
      }
    }
  }
}
