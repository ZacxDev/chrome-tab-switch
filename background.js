import { COMMANDS, computeTargetIndex } from "./tab-switch.js";

chrome.commands.onCommand.addListener(async (command) => {
  let spec = COMMANDS[command];
  if (!spec) {
    return;
  }

  let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
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
