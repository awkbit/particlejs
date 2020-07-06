import { Attract } from "./Attract";
import { MoveDirection, OutMode } from "@enums";
import { Trail } from "./Trail";
import { Noise } from "./Noise/Noise";
export class Move {
  constructor() {
    this.angle = 90;
    this.attract = new Attract();
    this.direction = MoveDirection.none;
    this.enable = false;
    this.noise = new Noise();
    this.outMode = OutMode.out;
    this.random = false;
    this.speed = 2;
    this.straight = false;
    this.trail = new Trail();
    this.vibrate = false;
    this.warp = false;
  }
  get collisions() {
    return false;
  }
  set collisions(value) {}
  get bounce() {
    return this.collisions;
  }
  set bounce(value) {
    this.collisions = value;
  }
  get out_mode() {
    return this.outMode;
  }
  set out_mode(value) {
    this.outMode = value;
  }
  load(data) {
    var _a;
    if (data === undefined) {
      return;
    }
    if (data.angle !== undefined) {
      this.angle = data.angle;
    }
    this.attract.load(data.attract);
    if (data.direction !== undefined) {
      this.direction = data.direction;
    }
    if (data.enable !== undefined) {
      this.enable = data.enable;
    }
    this.noise.load(data.noise);
    const outMode =
      (_a = data.outMode) !== null && _a !== void 0 ? _a : data.out_mode;
    if (outMode !== undefined) {
      this.outMode = outMode;
    }
    if (data.random !== undefined) {
      this.random = data.random;
    }
    if (data.speed !== undefined) {
      this.speed = data.speed;
    }
    if (data.straight !== undefined) {
      this.straight = data.straight;
    }
    this.trail.load(data.trail);
    if (data.vibrate !== undefined) {
      this.vibrate = data.vibrate;
    }
    if (data.warp !== undefined) {
      this.warp = data.warp;
    }
  }
}
