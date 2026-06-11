import { describe, it, expect } from "vitest";
import { COMMANDS, computeTargetIndex } from "./tab-switch.js";

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

describe("COMMANDS map", () => {
  it("maps switch commands to the switch action", () => {
    expect(COMMANDS["switch-to-next-tab"]).toEqual({ action: "switch", direction: "next" });
    expect(COMMANDS["switch-to-prev-tab"]).toEqual({ action: "switch", direction: "prev" });
  });

  it("maps move commands to the move action", () => {
    expect(COMMANDS["move-tab-right"]).toEqual({ action: "move", direction: "next" });
    expect(COMMANDS["move-tab-left"]).toEqual({ action: "move", direction: "prev" });
  });

  it("has no entry for unknown commands", () => {
    expect(COMMANDS["bogus-command"]).toBeUndefined();
  });
});
