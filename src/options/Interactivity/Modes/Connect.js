import { ConnectLinks } from "./ConnectLinks"
export class Connect {
  constructor() {
    this.distance = 80
    this.links = new ConnectLinks()
    this.radius = 60
  }
  get line_linked() {
    return this.links
  }
  set line_linked(value) {
    this.links = value
  }
  get lineLinked() {
    return this.links
  }
  set lineLinked(value) {
    this.links = value
  }
  load(data) {
    if (data === undefined) {
      return
    }
    if (data.distance !== undefined) {
      this.distance = data.distance
    }
    this.links.load(data.links ?? data.lineLinked ?? data.line_linked)

    if (data.radius !== undefined) {
      this.radius = data.radius
    }
  }
}
