import { ClickEvent } from "./ClickEvent"

import { HoverEvent } from "./HoverEvent"
export class Events {
  constructor() {
    this.onClick = new ClickEvent()

    this.onHover = new HoverEvent()
    this.resize = true
  }
  get onclick() {
    return this.onClick
  }
  set onclick(value) {
    this.onClick = value
  }

  get onhover() {
    return this.onHover
  }
  set onhover(value) {
    this.onHover = value
  }
  load(data) {
    var _a, _c
    if (data === undefined) {
      return
    }
    this.onClick.load(
      (_a = data.onClick) !== null && _a !== void 0 ? _a : data.onclick
    )

    this.onHover.load(
      (_c = data.onHover) !== null && _c !== void 0 ? _c : data.onhover
    )
    if (data.resize !== undefined) {
      this.resize = data.resize
    }
  }
}
