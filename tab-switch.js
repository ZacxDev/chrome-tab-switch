// Pure tab-index logic, isolated from the chrome.* API so it can be unit-tested.

/**
 * Map of keyboard command -> what it does.
 *   action: "switch" activates the target tab; "move" relocates the current tab there.
 *   direction: "next" (right, wrapping to first) or "prev" (left, wrapping to last).
 */
export const COMMANDS = {
  "switch-to-next-tab": { action: "switch", direction: "next" },
  "switch-to-prev-tab": { action: "switch", direction: "prev" },
  "move-tab-right": { action: "move", direction: "next" },
  "move-tab-left": { action: "move", direction: "prev" },
};

/**
 * Compute the target tab index, with wrap-around cycling.
 *
 * @param {string} direction - "next" or "prev".
 * @param {number} currentIndex - Index of the active tab in the tab list.
 * @param {number} length - Total number of tabs in the window.
 * @returns {number|null} Target index, or null if the input can't yield a valid tab.
 */
export function computeTargetIndex(direction, currentIndex, length) {
  if (length <= 0 || currentIndex < 0 || currentIndex >= length) {
    return null;
  }

  if (direction === "next") {
    return (currentIndex + 1) % length;
  }

  if (direction === "prev") {
    return (currentIndex - 1 + length) % length;
  }

  return null;
}
