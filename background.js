import { computeNextIndex } from "./tab-switch.js";

chrome.commands.onCommand.addListener(async (command) => {
  let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let allTabs = await chrome.tabs.query({ currentWindow: true });

  let currentIndex = allTabs.findIndex(tab => tab.id === currentTab.id);
  let nextIndex = computeNextIndex(command, currentIndex, allTabs.length);

  if (nextIndex === null) {
    return;
  }

  chrome.tabs.update(allTabs[nextIndex].id, { active: true });
});
