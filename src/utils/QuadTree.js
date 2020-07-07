import { Rectangle } from "./Rectangle";
export class QuadTree {
  constructor(rectangle, capacity) {
    this.rectangle = rectangle;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    const { x, y } = this.rectangle.position;

    const w = this.rectangle.size.width;
    const h = this.rectangle.size.height;
    const capacity = this.capacity;
    this.northEast = new QuadTree(new Rectangle(x, y, w / 2, h / 2), capacity);
    this.northWest = new QuadTree(
      new Rectangle(x + w / 2, y, w / 2, h / 2),
      capacity
    );
    this.southEast = new QuadTree(
      new Rectangle(x, y + h / 2, w / 2, h / 2),
      capacity
    );
    this.southWest = new QuadTree(
      new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2),
      capacity
    );
    this.divided = true;
  }
  insert(particle) {
    if (!this.rectangle.contains(particle)) {
      return false;
    }
    if (this.points.length < this.capacity) {
      this.points.push(particle);
      return true;
    }
    if (!this.divided) {
      this.subdivide();
    }
    return (
      (this.northEast?.insert(particle) ||
        this.northWest?.insert(particle) ||
        this.southEast?.insert(particle) ||
        this.southWest?.insert(particle)) ??
      false
    );
  }
  query(range, found) {
    const res = found ?? [];
    if (!range.intersects(this.rectangle)) {
      return [];
    } else {
      for (const p of this.points.filter((p) => range.contains(p))) {
        res.push(p);
      }
      if (this.divided) {
        this.northEast?.query(range, res);
        this.northWest?.query(range, res);
        this.southEast?.query(range, res);
        this.southWest?.query(range, res);
      }
    }
    return res;
  }
}
