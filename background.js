import { COMMANDS, computeTargetIndex, updateMru, removeFromMru, getMostRecentTabId } from "./tab-switch.js";

// MRU ordering must survive the ephemeral service worker, so it lives in
// chrome.storage.session (key "mru") rather than a module variable.
async function loadMru() {
  let { mru = [] } = await chrome.storage.session.get("mru");
  return mru;
}

async function saveMru(list) {
  await chrome.storage.session.set({ mru: list });
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  let mru = await loadMru();
  await saveMru(updateMru(mru, tabId));
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  let mru = await loadMru();
  await saveMru(removeFromMru(mru, tabId));
});

chrome.commands.onCommand.addListener(async (command) => {
  let spec = COMMANDS[command];
  if (!spec) {
    return;
  }

  let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (spec.action === "mru") {
    let mru = await loadMru();
    let targetId = getMostRecentTabId(mru, currentTab.id);
    if (targetId !== null) {
      // The MRU list spans all windows, so the target may live elsewhere —
      // activate it and bring its window forward so the jump is visible.
      let target = await chrome.tabs.update(targetId, { active: true });
      if (target && target.windowId !== currentTab.windowId) {
        chrome.windows.update(target.windowId, { focused: true });
      }
    }
    return;
  }

  let allTabs = await chrome.tabs.query({ currentWindow: true });

  let currentIndex = allTabs.findIndex(tab => tab.id === currentTab.id);
  let targetIndex = computeTargetIndex(spec.direction, currentIndex, allTabs.length);

  if (targetIndex === null) {
    return;
  }

  if (spec.action === "switch") {
    chrome.tabs.update(allTabs[targetIndex].id, { active: true });
  } else {
    chrome.tabs.move(currentTab.id, { index: targetIndex });
  }
});
