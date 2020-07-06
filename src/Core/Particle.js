import { Updater } from "./Particle/Updater";
import { Particles as ParticlesOptions } from "@options/Particles/Particles";
import { Shape as ShapeOptions } from "@options/Particles/Shape/Shape";
import {
  OpacityAnimationStatus,
  RotateDirection,
  SizeAnimationStatus,
  StartValueType,
} from "@enums";
import { ColorUtils, Utils } from "@utils";
export class Particle {
  constructor(container, position, overrideOptions) {
    var _k, _l, _m;
    this.container = container;
    this.fill = true;
    this.close = true;
    this.links = [];
    this.linkColor = ColorUtils.getRandomRgbColor();
    this.lastNoiseTime = 0;
    this.destroyed = false;
    const options = container.options;
    const particlesOptions = new ParticlesOptions();
    particlesOptions.load(options.particles);
    if (
      (overrideOptions === null || overrideOptions === void 0
        ? void 0
        : overrideOptions.shape) !== undefined
    ) {
      const shapeType =
        overrideOptions.shape.type ?? particlesOptions.shape.type;
      this.shape =
        shapeType instanceof Array ? Utils.itemFromArray(shapeType) : shapeType;
      const shapeOptions = new ShapeOptions();
      shapeOptions.load(overrideOptions.shape);
      if (this.shape !== undefined) {
        const shapeData = shapeOptions.options[this.shape];
        if (shapeData !== undefined) {
          this.shapeData = Utils.deepExtend(
            {},
            shapeData instanceof Array
              ? Utils.itemFromArray(shapeData)
              : shapeData
          );
          this.fill = this.shapeData?.fill ?? this.fill;
          this.close = this.shapeData?.close ?? this.close;
        }
      }
    } else {
      const shapeType = particlesOptions.shape.type;
      this.shape =
        shapeType instanceof Array ? Utils.itemFromArray(shapeType) : shapeType;
      const shapeData = particlesOptions.shape.options[this.shape];
      if (shapeData) {
        this.shapeData = Utils.deepExtend(
          {},
          shapeData instanceof Array
            ? Utils.itemFromArray(shapeData)
            : shapeData
        );
        this.fill = this.shapeData?.fill ?? this.fill;
        this.close = this.shapeData?.close ?? this.close;
      }
    }
    if (overrideOptions !== undefined) {
      particlesOptions.load(overrideOptions);
    }
    if (
      ((_k = this.shapeData) === null || _k === void 0
        ? void 0
        : _k.particles) !== undefined
    ) {
      particlesOptions.load(this.shapeData.particles);
    }
    this.particlesOptions = particlesOptions;
    const noiseDelay = this.particlesOptions.move.noise.delay;
    this.noiseDelay =
      (noiseDelay.random.enable
        ? Utils.randomInRange(noiseDelay.random.minimumValue, noiseDelay.value)
        : noiseDelay.value) * 1000;
    container.retina.initParticle(this);
    const { color } = this.particlesOptions;
    const sizeValue =
      (_l = this.sizeValue) !== null && _l !== void 0
        ? _l
        : container.retina.sizeValue;
    const randomSize =
      typeof this.particlesOptions.size.random === "boolean"
        ? this.particlesOptions.size.random
        : this.particlesOptions.size.random.enable;
    this.size = {
      value:
        randomSize && this.randomMinimumSize !== undefined
          ? Utils.randomInRange(this.randomMinimumSize, sizeValue)
          : sizeValue,
    };
    this.direction = this.particlesOptions.move.direction;
    this.bubble = {
      inRange: false,
    };
    this.angle = this.particlesOptions.rotate.random
      ? Math.random() * 360
      : this.particlesOptions.rotate.value;
    if (this.particlesOptions.rotate.direction === RotateDirection.random) {
      const index = Math.floor(Math.random() * 2);
      if (index > 0) {
        this.rotateDirection = RotateDirection.counterClockwise;
      } else {
        this.rotateDirection = RotateDirection.clockwise;
      }
    } else {
      this.rotateDirection = this.particlesOptions.rotate.direction;
    }
    if (this.particlesOptions.size.animation.enable) {
      switch (this.particlesOptions.size.animation.startValue) {
        case StartValueType.min:
          if (!randomSize) {
            const pxRatio = container.retina.pixelRatio;
            this.size.value =
              this.particlesOptions.size.animation.minimumValue * pxRatio;
          }
          break;
      }
      this.size.status = SizeAnimationStatus.increasing;
      this.size.velocity =
        ((_m = this.sizeAnimationSpeed) !== null && _m !== void 0
          ? _m
          : container.retina.sizeAnimationSpeed) / 100;
      if (!this.particlesOptions.size.animation.sync) {
        this.size.velocity = this.size.velocity * Math.random();
      }
    }
    if (this.particlesOptions.color.animation.enable) {
      this.colorVelocity = this.particlesOptions.color.animation.speed / 100;
      if (!this.particlesOptions.color.animation.sync) {
        this.colorVelocity = this.colorVelocity * Math.random();
      }
    } else {
      this.colorVelocity = 0;
    }
    if (this.particlesOptions.rotate.animation.enable) {
      if (!this.particlesOptions.rotate.animation.sync) {
        this.angle = Math.random() * 360;
      }
    }
    this.position = this.calcPosition(this.container, position);
    this.offset = {
      x: 0,
      y: 0,
    };

    this.color = ColorUtils.colorToHsl(color);
    const randomOpacity = this.particlesOptions.opacity.random;
    const opacityValue = this.particlesOptions.opacity.value;
    this.opacity = {
      value: randomOpacity.enable
        ? Utils.randomInRange(randomOpacity.minimumValue, opacityValue)
        : opacityValue,
    };
    if (this.particlesOptions.opacity.animation.enable) {
      this.opacity.status = OpacityAnimationStatus.increasing;
      this.opacity.velocity =
        this.particlesOptions.opacity.animation.speed / 100;
      if (!this.particlesOptions.opacity.animation.sync) {
        this.opacity.velocity *= Math.random();
      }
    }
    this.initialVelocity = this.calculateVelocity();
    this.velocity = {
      horizontal: this.initialVelocity.horizontal,
      vertical: this.initialVelocity.vertical,
    };

    this.stroke =
      this.particlesOptions.stroke instanceof Array
        ? Utils.itemFromArray(this.particlesOptions.stroke)
        : this.particlesOptions.stroke;
    this.strokeColor = ColorUtils.colorToRgb(this.stroke.color);

    this.updater = new Updater(this.container, this);
  }
  update(delta) {
    this.links.length = 0;
    this.updater.update(delta);
  }
  draw(delta) {
    this.container.canvas.drawParticle(this, delta);
  }

  getPosition() {
    return {
      x: this.position.x + this.offset.x,
      y: this.position.y + this.offset.y,
    };
  }
  getColor() {
    var _a;
    return (_a = this.bubble.color) !== null && _a !== void 0 ? _a : this.color;
  }
  destroy() {
    this.destroyed = true;
  }

  calcPosition(container, position) {
    var _a, _b;
    for (const [, plugin] of container.plugins) {
      const pluginPos =
        plugin.particlePosition !== undefined
          ? plugin.particlePosition(position, this)
          : undefined;
      if (pluginPos !== undefined) {
        return Utils.deepExtend({}, pluginPos);
      }
    }
    const pos = {
      x:
        (_a =
          position === null || position === void 0 ? void 0 : position.x) !==
          null && _a !== void 0
          ? _a
          : Math.random() * container.canvas.size.width,
      y:
        (_b =
          position === null || position === void 0 ? void 0 : position.y) !==
          null && _b !== void 0
          ? _b
          : Math.random() * container.canvas.size.height,
    };

    return pos;
  }
  calculateVelocity() {
    const baseVelocity = Utils.getParticleBaseVelocity(this);
    const res = {
      horizontal: 0,
      vertical: 0,
    };
    const moveOptions = this.particlesOptions.move;
    const rad = (Math.PI / 180) * moveOptions.angle;
    const rad45 = Math.PI / 4;
    const range = {
      left: Math.sin(rad45 + rad / 2) - Math.sin(rad45 - rad / 2),
      right: Math.cos(rad45 + rad / 2) - Math.cos(rad45 - rad / 2),
    };
    if (moveOptions.straight) {
      res.horizontal = baseVelocity.x;
      res.vertical = baseVelocity.y;
      if (moveOptions.random) {
        res.horizontal += Utils.randomInRange(range.left, range.right) / 2;
        res.vertical += Utils.randomInRange(range.left, range.right) / 2;
      }
    } else {
      res.horizontal =
        baseVelocity.x + Utils.randomInRange(range.left, range.right) / 2;
      res.vertical =
        baseVelocity.y + Utils.randomInRange(range.left, range.right) / 2;
    }
    return res;
  }
}
