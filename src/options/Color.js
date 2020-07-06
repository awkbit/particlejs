export class OptionsColor {
  constructor() {
    this.value = "#fff";
  }
  static create(source, data) {
    const color =
      source !== null && source !== void 0 ? source : new OptionsColor();
    if (data !== undefined) {
      color.load(typeof data === "string" ? { value: data } : data);
    }
    return color;
  }
  load(data) {
    if (data?.value === undefined) {
      return;
    }
    this.value = data.value;
  }
}
