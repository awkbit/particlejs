import { OptionsColor } from "@options/Color";
export class GrabLinks {
  constructor() {
    this.opacity = 1;
  }
  load(data) {
    if (data === undefined) {
      return;
    }
    if (data.opacity !== undefined) {
      this.opacity = data.opacity;
    }
    if (data.color !== undefined) {
      this.color = OptionsColor.create(this.color, data.color);
    }
  }
}
