function defaultEquals(a, b) {
  return a === b;
}

class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

class LinkedList {
  constructor(equalsFn = defaultEquals) {
    this.count = 0;
    this.head = null;
    this.equalsFn = equalsFn;
  }

  push(element) {
    const node = new Node(element);
    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = node;
    }
    this.count = this.count + 1;
  }

  getElementAt(index) {
    if (index < 0 || index > this.count) return undefined;

    let node = this.head;
    for (let i = 0; i < index && node !== null; i++) {
      node = node.next;
    }

    return node;
  }

  insert(element, index) {
    if (index < 0 || index > this.count) return false;

    const node = new Node(element);
    if (index === 0) {
      // 在第一个位置添加
      const current = this.head;
      node.next = current;
      this.head = node;
    } else {
      const previous = this.getElementAt(index - 1);
      const current = previous.next;
      node.next = current;
      previous.next = node;
    }

    this.count = this.count + 1;
    return true;
  }

  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.count && current !== null; i++) {
      if (this.equalsFn(element, current.element)) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }

  remove(element) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  size() {
    return this.count;
  }

  isEmpty() {
    return this.size() === 0;
  }

  getHead() {
    return this.head;
  }

  toString() {
    if (this.head === null) {
      return '';
    }

    let result = `${this.head.element}`;
    const current = this.head.next;
    for (let i = 0; i < this.size() && current !== null; i++) {
      result = `${result}, ${current.element}`;
      current = current.next;
    }
    return result;
  }

  removeAt(index) {
    if (index < 0 || index > this.count) return undefined;

    let current = this.head;
    // 移除第一项
    if (index === 0) {
      this.head = current.next;
    } else {
      const previous = this.getElementAt(index - 1);
      const current = previous.next;
      previous.next = current.next;
    }
    this.count = this.count - 1;
    return current.element;
  }
}

const linkedList = new LinkedList();

linkedList.push(1);

console.log(linkedList.toString());
