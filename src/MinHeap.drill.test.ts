import { describe, it, expect } from "vitest";
import { MinHeap } from "./MinHeap.drill";

describe("MinHeap (drill)", () => {
  const numCmp = (a: number, b: number) => a - b;

  it("peeks the minimum", () => {
    const h = new MinHeap<number>(numCmp);
    [5, 3, 8, 1, 9, 2].forEach((v) => h.push(v));
    expect(h.peek()).toBe(1);
  });

  it("pops in sorted order", () => {
    const h = new MinHeap<number>(numCmp);
    [5, 3, 8, 1, 9, 2, 7, 4, 6].forEach((v) => h.push(v));
    const out: number[] = [];
    while (h.size() > 0) out.push(h.pop()!);
    expect(out).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("handles empty pop and peek", () => {
    const h = new MinHeap<number>(numCmp);
    expect(h.pop()).toBeUndefined();
    expect(h.peek()).toBeUndefined();
    expect(h.size()).toBe(0);
  });

  it("works as a max-heap by inverting cmp", () => {
    const h = new MinHeap<number>((a, b) => b - a);
    [5, 3, 8, 1, 9, 2].forEach((v) => h.push(v));
    expect(h.pop()).toBe(9);
    expect(h.pop()).toBe(8);
  });

  it("handles objects with custom cmp", () => {
    type T = { score: number; id: string };
    const h = new MinHeap<T>((a, b) => a.score - b.score);
    h.push({ score: 5, id: "a" });
    h.push({ score: 1, id: "b" });
    h.push({ score: 3, id: "c" });
    expect(h.pop()?.id).toBe("b");
    expect(h.pop()?.id).toBe("c");
  });
});
