import { describe, it, expect } from "vitest";
import {
  COMMANDS,
  computeTargetIndex,
  updateMru,
  removeFromMru,
  getMostRecentTabId,
} from "./tab-switch.js";

describe("computeTargetIndex — next", () => {
  it("advances to the following tab", () => {
    expect(computeTargetIndex("next", 0, 3)).toBe(1);
    expect(computeTargetIndex("next", 1, 3)).toBe(2);
  });

  it("wraps from the last tab to the first", () => {
    expect(computeTargetIndex("next", 2, 3)).toBe(0);
  });
});

describe("computeTargetIndex — prev", () => {
  it("moves to the preceding tab", () => {
    expect(computeTargetIndex("prev", 2, 3)).toBe(1);
    expect(computeTargetIndex("prev", 1, 3)).toBe(0);
  });

  it("wraps from the first tab to the last", () => {
    expect(computeTargetIndex("prev", 0, 3)).toBe(2);
  });
});

describe("computeTargetIndex — single tab window", () => {
  it("stays on the only tab for next", () => {
    expect(computeTargetIndex("next", 0, 1)).toBe(0);
  });

  it("stays on the only tab for prev", () => {
    expect(computeTargetIndex("prev", 0, 1)).toBe(0);
  });
});

describe("computeTargetIndex — invalid input returns null", () => {
  it("rejects an unrecognized direction", () => {
    expect(computeTargetIndex("sideways", 0, 3)).toBeNull();
  });

  it("rejects an empty tab list", () => {
    expect(computeTargetIndex("next", 0, 0)).toBeNull();
  });

  it("rejects a not-found current index (-1)", () => {
    expect(computeTargetIndex("next", -1, 3)).toBeNull();
  });

  it("rejects an out-of-range current index", () => {
    expect(computeTargetIndex("next", 5, 3)).toBeNull();
  });
});

describe("updateMru", () => {
  it("inserts a new id at the front", () => {
    expect(updateMru([2, 3], 1)).toEqual([1, 2, 3]);
  });

  it("moves an existing id to the front, removing the duplicate", () => {
    expect(updateMru([1, 2, 3], 3)).toEqual([3, 1, 2]);
    expect(updateMru([1, 2, 3], 2)).toEqual([2, 1, 3]);
  });

  it("does not mutate the input array", () => {
    let input = [2, 3];
    let result = updateMru(input, 1);
    expect(input).toEqual([2, 3]);
    expect(result).not.toBe(input);
  });

  it("works on an empty list", () => {
    expect(updateMru([], 1)).toEqual([1]);
  });
});

describe("removeFromMru", () => {
  it("removes a present id", () => {
    expect(removeFromMru([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it("is a no-op when the id is absent", () => {
    expect(removeFromMru([1, 2, 3], 9)).toEqual([1, 2, 3]);
  });

  it("returns a new array", () => {
    let input = [1, 2, 3];
    let result = removeFromMru(input, 2);
    expect(result).not.toBe(input);
    expect(input).toEqual([1, 2, 3]);
  });

  it("works on an empty list", () => {
    expect(removeFromMru([], 1)).toEqual([]);
  });
});

describe("getMostRecentTabId", () => {
  it("returns the first non-current id", () => {
    expect(getMostRecentTabId([2, 3, 1], 1)).toBe(2);
  });

  it("skips the current id when it is at the front", () => {
    expect(getMostRecentTabId([1, 2, 3], 1)).toBe(2);
  });

  it("returns null for an empty list", () => {
    expect(getMostRecentTabId([], 1)).toBeNull();
  });

  it("returns null when current is the only entry", () => {
    expect(getMostRecentTabId([1], 1)).toBeNull();
  });
});

describe("COMMANDS map", () => {
  it("maps switch commands to the switch action", () => {
    expect(COMMANDS["switch-to-next-tab"]).toEqual({ action: "switch", direction: "next" });
    expect(COMMANDS["switch-to-prev-tab"]).toEqual({ action: "switch", direction: "prev" });
  });

  it("maps move commands to the move action", () => {
    expect(COMMANDS["move-tab-right"]).toEqual({ action: "move", direction: "next" });
    expect(COMMANDS["move-tab-left"]).toEqual({ action: "move", direction: "prev" });
  });

  it("maps the most-recent command to the mru action", () => {
    expect(COMMANDS["switch-to-most-recent-tab"]).toEqual({ action: "mru" });
  });

  it("has no entry for unknown commands", () => {
    expect(COMMANDS["bogus-command"]).toBeUndefined();
  });
});
