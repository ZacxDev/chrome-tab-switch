import { describe, it, expect } from "vitest";
import { computeNextIndex } from "./tab-switch.js";

const NEXT = "switch-to-next-tab";
const PREV = "switch-to-prev-tab";

describe("computeNextIndex — next tab", () => {
  it("advances to the following tab", () => {
    expect(computeNextIndex(NEXT, 0, 3)).toBe(1);
    expect(computeNextIndex(NEXT, 1, 3)).toBe(2);
  });

  it("wraps from the last tab to the first", () => {
    expect(computeNextIndex(NEXT, 2, 3)).toBe(0);
  });
});

describe("computeNextIndex — previous tab", () => {
  it("moves to the preceding tab", () => {
    expect(computeNextIndex(PREV, 2, 3)).toBe(1);
    expect(computeNextIndex(PREV, 1, 3)).toBe(0);
  });

  it("wraps from the first tab to the last", () => {
    expect(computeNextIndex(PREV, 0, 3)).toBe(2);
  });
});

describe("computeNextIndex — single tab window", () => {
  it("stays on the only tab for next", () => {
    expect(computeNextIndex(NEXT, 0, 1)).toBe(0);
  });

  it("stays on the only tab for previous", () => {
    expect(computeNextIndex(PREV, 0, 1)).toBe(0);
  });
});

describe("computeNextIndex — invalid input returns null", () => {
  it("rejects an unrecognized command", () => {
    expect(computeNextIndex("switch-to-mars", 0, 3)).toBeNull();
  });

  it("rejects an empty tab list", () => {
    expect(computeNextIndex(NEXT, 0, 0)).toBeNull();
  });

  it("rejects a not-found current index (-1)", () => {
    expect(computeNextIndex(NEXT, -1, 3)).toBeNull();
  });

  it("rejects an out-of-range current index", () => {
    expect(computeNextIndex(NEXT, 5, 3)).toBeNull();
  });
});
