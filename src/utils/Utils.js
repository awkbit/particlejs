import { MoveDirection } from "@enums";
import { ColorUtils } from "./ColorUtils";
export class Utils {
  static isSsr() {
    return typeof window === "undefined" || !window;
  }
  static get animate() {
    return this.isSsr()
      ? (callback) => setTimeout(callback)
      : (callback) =>
          (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.setTimeout
          )(callback);
  }
  static get cancelAnimation() {
    return this.isSsr()
      ? (handle) => clearTimeout(handle)
      : (handle) =>
          (
            window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            window.clearTimeout
          )(handle);
  }
  static replaceColorSvg(image, color, opacity) {
    if (!image.svgData) {
      return "";
    }
    const svgXml = image.svgData;
    const rgbHex = /#([0-9A-F]{3,6})/gi;
    return svgXml.replace(rgbHex, () =>
      ColorUtils.getStyleFromHsl(color, opacity)
    );
  }
  static clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }
  static isInArray(value, array) {
    return (
      value === array || (array instanceof Array && array.indexOf(value) > -1)
    );
  }
  static mix(comp1, comp2, weight1, weight2) {
    return Math.floor(
      (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2)
    );
  }
  static getParticleBaseVelocity(particle) {
    let velocityBase;
    switch (particle.direction) {
      case MoveDirection.top:
        velocityBase = { x: 0, y: -1 };
        break;
      case MoveDirection.topRight:
        velocityBase = { x: 0.5, y: -0.5 };
        break;
      case MoveDirection.right:
        velocityBase = { x: 1, y: -0 };
        break;
      case MoveDirection.bottomRight:
        velocityBase = { x: 0.5, y: 0.5 };
        break;
      case MoveDirection.bottom:
        velocityBase = { x: 0, y: 1 };
        break;
      case MoveDirection.bottomLeft:
        velocityBase = { x: -0.5, y: 1 };
        break;
      case MoveDirection.left:
        velocityBase = { x: -1, y: 0 };
        break;
      case MoveDirection.topLeft:
        velocityBase = { x: -0.5, y: -0.5 };
        break;
      default:
        velocityBase = { x: 0, y: 0 };
        break;
    }
    return velocityBase;
  }
  static getDistances(pointA, pointB) {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return { dx: dx, dy: dy, distance: Math.sqrt(dx * dx + dy * dy) };
  }
  static getDistance(pointA, pointB) {
    return this.getDistances(pointA, pointB).distance;
  }

  static arrayRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
  }
  static itemFromArray(array, index) {
    return array[index !== undefined ? index : this.arrayRandomIndex(array)];
  }
  static randomInRange(r1, r2) {
    const [min, max] = r1 > r2 ? [r2, r1] : [r1, r2];

    return Math.random() * (max - min) + min;
  }
  static isPointInside(point, size, radius) {
    return this.areBoundsInside(this.calculateBounds(point, radius ?? 0), size);
  }
  static areBoundsInside(bounds, size) {
    return (
      bounds.left < size.width &&
      bounds.right > 0 &&
      bounds.top < size.height &&
      bounds.bottom > 0
    );
  }
  static calculateBounds(point, radius) {
    return {
      bottom: point.y + radius,
      left: point.x - radius,
      right: point.x + radius,
      top: point.y - radius,
    };
  }

  static deepExtend(destination, ...sources) {
    for (const source of sources) {
      if (source === undefined || source === null) {
        continue;
      }
      if (typeof source !== "object") {
        destination = source;
        continue;
      }
      const sourceIsArray = Array.isArray(source);
      if (
        sourceIsArray &&
        (typeof destination !== "object" ||
          !destination ||
          !Array.isArray(destination))
      ) {
        destination = [];
      } else if (
        !sourceIsArray &&
        (typeof destination !== "object" ||
          !destination ||
          Array.isArray(destination))
      ) {
        destination = {};
      }
      for (const key in source) {
        if (key === "__proto__") {
          continue;
        }
        const value = source[key];
        const isObject = typeof value === "object";
        destination[key] =
          isObject && Array.isArray(value)
            ? value.map((v) => this.deepExtend(destination[key], v))
            : this.deepExtend(destination[key], value);
      }
    }
    return destination;
  }
  static isDivModeEnabled(mode, divs) {
    return divs instanceof Array
      ? divs.filter((t) => t.enable && Utils.isInArray(mode, t.mode)).length > 0
      : Utils.isInArray(mode, divs.mode);
  }
  static divModeExecute(mode, divs, callback) {
    if (divs instanceof Array) {
      for (const div of divs) {
        const divMode = div.mode;
        const divEnabled = div.enable;
        if (divEnabled && Utils.isInArray(mode, divMode)) {
          this.singleDivModeExecute(div, callback);
        }
      }
    } else {
      const divMode = divs.mode;
      const divEnabled = divs.enable;
      if (divEnabled && Utils.isInArray(mode, divMode)) {
        this.singleDivModeExecute(divs, callback);
      }
    }
  }
  static singleDivModeExecute(div, callback) {
    const ids = div.ids;
    if (ids instanceof Array) {
      for (const id of ids) {
        callback(id, div);
      }
    } else {
      callback(ids, div);
    }
  }
  static divMode(divs, divId) {
    if (!divId) {
      return;
    }
    if (!divs) {
      return;
    }
    if (divs instanceof Array) {
      return divs.find((d) => Utils.isInArray(divId, d.ids));
    } else if (Utils.isInArray(divId, divs.ids)) {
      return divs;
    }
  }
}
