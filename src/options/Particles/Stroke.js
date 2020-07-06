import { OptionsColor } from "@options/Color";
export class Stroke {
  constructor() {
    this.color = new OptionsColor();
    this.width = 0;
    this.opacity = 1;
    this.color.value = "#ff0000";
  }
  load(data) {
    if (data === undefined) {
      return;
    }
    this.color = OptionsColor.create(this.color, data.color);
    if (data.width !== undefined) {
      this.width = data.width;
    }
    if (data.opacity !== undefined) {
      this.opacity = data.opacity;
    }
  }
}
