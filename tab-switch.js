// Pure tab-index logic, isolated from the chrome.* API so it can be unit-tested.

/**
 * Compute the index of the tab to switch to, with wrap-around cycling.
 *
 * @param {string} command - "switch-to-next-tab" or "switch-to-prev-tab".
 * @param {number} currentIndex - Index of the active tab in the tab list.
 * @param {number} length - Total number of tabs in the window.
 * @returns {number|null} Target index, or null if the input can't yield a valid tab.
 */
export function computeNextIndex(command, currentIndex, length) {
  if (length <= 0 || currentIndex < 0 || currentIndex >= length) {
    return null;
  }

  if (command === "switch-to-next-tab") {
    return (currentIndex + 1) % length;
  }

  if (command === "switch-to-prev-tab") {
    return (currentIndex - 1 + length) % length;
  }

  return null;
}
