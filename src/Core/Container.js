import { __awaiter } from "tslib";
import { Canvas } from "./Canvas";
import { Particles } from "./Particles";
import { Retina } from "./Retina";
import { FrameManager } from "./FrameManager";
import { Options } from "@options";
import { EventListeners, Utils } from "@utils";
import { ShapeType } from "@enums/Types";
import { CircleDrawer } from "../ShapeDrawers/CircleDrawer";

export class Container {
  constructor(id, sourceOptions) {
    this.id = id;
    this.sourceOptions = sourceOptions;
    this.started = false;
    this.destroyed = false;
    this.paused = true;
    this.lastFrameTime = 0;
    this.pageHidden = false;

    this.retina = new Retina(this);
    this.canvas = new Canvas(this);
    this.particles = new Particles(this);
    this.drawer = new FrameManager(this);

    this.interactivity = {
      mouse: {},
    };
    this.bubble = {};
    this.repulse = { particles: [] };
    this.plugins = new Map();
    this.drawers = new Map();
    this.density = 1;
    this.options = new Options();

    this.drawers.set(ShapeType.circle, new CircleDrawer());

    if (this.sourceOptions) {
      this.options.load(this.sourceOptions);
    }
    this.eventListeners = new EventListeners(this);
  }
  play(force) {
    const needsUpdate = this.paused || force;
    if (this.paused) {
      this.paused = false;
    }
    if (needsUpdate) {
      for (const [, plugin] of this.plugins) {
        if (plugin.play) {
          plugin.play();
        }
      }
      this.lastFrameTime = performance.now();
    }
    this.draw();
  }
  pause() {
    if (this.drawAnimationFrame !== undefined) {
      Utils.cancelAnimation(this.drawAnimationFrame);
      delete this.drawAnimationFrame;
    }
    if (this.paused) {
      return;
    }
    for (const [, plugin] of this.plugins) {
      if (plugin.pause) {
        plugin.pause();
      }
    }
    if (!this.pageHidden) {
      this.paused = true;
    }
  }
  draw() {
    this.drawAnimationFrame = Utils.animate((t) => this.drawer?.nextFrame(t));
  }
  getAnimationStatus() {
    return !this.paused;
  }

  densityAutoParticles() {
    this.initDensityFactor();
    const numberOptions = this.options.particles.number;
    const optParticlesNumber = numberOptions.value;
    const optParticlesLimit =
      numberOptions.limit > 0 ? numberOptions.limit : optParticlesNumber;
    const particlesNumber = Math.floor(
      Math.min(optParticlesNumber, optParticlesLimit) * this.density
    );
    const particlesCount = this.particles.count;
    if (particlesCount < particlesNumber) {
      this.particles.push(Math.abs(particlesNumber - particlesCount));
    } else if (particlesCount > particlesNumber) {
      this.particles.removeQuantity(particlesCount - particlesNumber);
    }
  }
  destroy() {
    this.stop();
    this.canvas.destroy();
    delete this.interactivity;
    delete this.options;
    delete this.retina;
    delete this.canvas;
    delete this.particles;
    delete this.bubble;
    delete this.repulse;
    delete this.drawer;
    delete this.eventListeners;
    for (const [, drawer] of this.drawers) {
      if (drawer.destroy) {
        drawer.destroy(this);
      }
    }
    this.drawers = new Map();
    this.destroyed = true;
  }
  exportImg(callback) {
    this.exportImage(callback);
  }
  exportImage(callback, type, quality) {
    var _a;
    return (_a = this.canvas.element) === null || _a === void 0
      ? void 0
      : _a.toBlob(
          callback,
          type !== null && type !== void 0 ? type : "image/png",
          quality
        );
  }
  exportConfiguration() {
    return JSON.stringify(this.options, undefined, 2);
  }
  refresh() {
    return __awaiter(this, void 0, void 0, function* () {
      this.stop();
      yield this.start();
    });
  }
  stop() {
    if (!this.started) {
      return;
    }
    this.started = false;
    this.eventListeners.removeListeners();
    this.pause();
    this.particles.clear();
    this.canvas.clear();

    this.plugins = new Map();
    this.particles.linksColors = {};
  }
  start() {
    if (this.started) {
      return;
    }
    this.init();
    this.started = true;
    this.eventListeners.addListeners();

    this.play();
  }
  init() {
    this.retina.init();
    this.canvas.init();

    this.particles.init();
    this.densityAutoParticles();
  }
  initDensityFactor() {
    const densityOptions = this.options.particles.number.density;
    if (!this.canvas.element || !densityOptions.enable) {
      return;
    }
    const canvas = this.canvas.element;
    const pxRatio = this.retina.pixelRatio;
    this.density =
      (canvas.width * canvas.height) /
      (densityOptions.factor * pxRatio * densityOptions.area);
  }
}
