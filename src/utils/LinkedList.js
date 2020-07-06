export default class LinkedList {
  constructor(node) {
    if (node) {
      this.head = node;
      this.size = 1;
      while (node.next) {
        node = node.next;
        this.size += 1;
      }
      this.tail = node;
    } else {
      this.tail = this.head = null;
      this.size = 0;
    }
  }
  push(data) {
    if (this.size === 0) {
      this.head = this.tail = createNode(data);
    } else {
      this.tail = this.tail.next = createNode(data);
    }

    this.size += 1;
  }
  shift(data) {
    if (this.size === 0) {
      this.head = this.tail = createNode(data);
    } else {
      const tmp = this.head;
      this.head = createNode(data);
      this.head.next = tmp;
    }

    this.size += 1;
  }
  unshift() {
    if (this.size === 0) {
      return null;
    }
    this.size -= 1;
    const unshifted = this.head;
    this.head = unshifted.next;
    return unshifted.data;
  }

  getAt(index) {
    if (index < 0 || index > this.size - 1)
      throw new RangeError(`Index ${index} does not exist in the list.`);
    return getNodeAt(this.head, index).data;
  }
  slice(from, to) {
    if (from < 0 || from > this.size - 2 || from > to)
      throw new RangeError(`Index ${from} does not exist in the list.`);

    if (from === 0) {
      const fromNode = this.head;
      const toPrevNode = getNodeAt(this.head, to - 1);
      if (toPrevNode && toPrevNode.next) {
        const toNode = toPrevNode.next;
        toPrevNode.next = null;
        this.head = toNode;
        this.size -= to;
      } else {
        this.head = this.tail = null;
        this.size = 0;
      }
      return new LinkedList(fromNode);
    }

    const fromNode = getNodeAt(this.head, from - 1);

    if (to >= this.size) {
      const slicedHead = fromNode.next;
      this.tail = fromNode;
      fromNode.next = null;
      this.size = from;

      return new LinkedList(slicedHead);
    }

    const toNode = getNodeAt(fromNode, to - from);
    if (toNode?.next) {
      const slicedHead = fromNode.next;
      fromNode.next = toNode.next;
      toNode.next = null;
      this.size -= to - from;
      return new LinkedList(slicedHead);
    }
  }
  [Symbol.iterator]() {
    return this.values();
  }

  *values() {
    let current = this.head;

    while (current !== null) {
      yield current.data;
      current = current.next;
    }
  }
}
LinkedList.createNode = createNode;

function createNode(data, next = null) {
  return {
    data,
    next,
  };
}

function getNodeAt(startNode, index) {
  let i = 0;
  let current = startNode;
  if (i < 0) throw new RangeError(`Index ${index} does not exist in the list.`);
  while (i < index && current.next) {
    current = current.next;
    i++;
  }

  return i === index ? current : undefined;
}

function getTail(node) {}
