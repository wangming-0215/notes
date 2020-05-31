class Queue {
  constructor() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }

  enqueue(element) {
    this.items[this.count] = element;
    this.count++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return result;
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this.items[this.lowestCount];
  }

  size() {
    return this.count - this.lowestCount;
  }

  isEmpty() {
    return this.size() === 0;
  }

  toString() {
    if (this.isEmpty()) {
      return '';
    }

    let result = `${this.items[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      result = `${result}, ${this.items[i]}`;
    }

    return `[${result}]`;
  }
}

const queue = new Queue();

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

queue.dequeue();

console.log(queue.peek());
console.log(queue.toString());
console.log(queue.size());
