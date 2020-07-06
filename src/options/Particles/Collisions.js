import { CollisionMode } from "@enums";
export class Collisions {
  constructor() {
    this.enable = false;
    this.mode = CollisionMode.bounce;
  }
  load(data) {
    if (data === undefined) {
      return;
    }
    if (data.enable !== undefined) {
      this.enable = data.enable;
    }
    if (data.mode !== undefined) {
      this.mode = data.mode;
    }
  }
}
