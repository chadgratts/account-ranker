/**
 * DAILY DRILL — re-type a working MinHeap from this blank file every morning.
 *
 * No peeking at MinHeap.ts until you're done. Then run:
 *   npx vitest run src/MinHeap.drill.test.ts
 *
 * Target: under 8 minutes by Saturday.
 *
 * API to implement:
 *   class MinHeap<T> {
 *     constructor(cmp: (a: T, b: T) => number)
 *     size(): number
 *     peek(): T | undefined
 *     push(v: T): void
 *     pop(): T | undefined
 *   }
 *
 * Hints (cover with your hand if you want a harder rep):
 *   - Store data in a flat array. Parent of i = (i-1) >> 1. Children = 2i+1, 2i+2.
 *   - push: append, then bubble up while smaller than parent.
 *   - pop: save data[0], move last element to index 0, bubble down to smaller child.
 */

export class MinHeap<T> {
  // TODO: implement from scratch. Do not copy from MinHeap.ts.
  private data: T[] = []
  constructor(private cmp: (a: T, b: T) => number) {}

  size(): number { return this.data.length }

  peek(): T { return this.data[0] }

  push(v: T) {
    this.data.push(v);
    this.bubbleUp(this.data.length - 1)
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined
    const top = this.data[0]
    const last = this.data.pop()!
    if (this.data.length > 0) {
      this.data[0] = last
      this.bubbleDown(0)
    }
    return top
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parentIdx = (i - 1) >> 1
      if (this.cmp(this.data[i], this.data[parentIdx]) < 0) {
        [this.data[i], this.data[parentIdx]] = [this.data[parentIdx], this.data[i]]
        i = parentIdx
      } else {
        break
      }
    }
  }

  private bubbleDown(i: number): void {
    const n = this.data.length

    while (i < n) {
      const left = 2 * i + 1
      const right = 2 * i + 2
      let smallest = i
      if (left < n && this.cmp(this.data[left], this.data[smallest]) < 0) {
        smallest = left
      }
      if (right < n && this.cmp(this.data[right], this.data[smallest]) < 0) {
        smallest = right
      }
      if (smallest === i) break
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]]
      i = smallest
    }
  }
}
