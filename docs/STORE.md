# Chrome Web Store submission

Reference for publishing Tab Switcher to the Chrome Web Store.

## Build the package

```bash
npm run build
```

Produces `tab-switcher-<version>.zip` containing only the runtime files
(`manifest.json`, `background.js`, `tab-switch.js`, and the four icons).
Upload that zip in the Developer Dashboard.

Bump `version` in `manifest.json` before each new submission — the store
rejects re-uploads that reuse a version string.

## Listing copy

**Name:** Tab Switcher

**Summary (≤132 chars):**
> Vim-style keyboard shortcuts to cycle, move, and alt-tab between browser tabs.

**Description:**
> Tab Switcher adds fast, keyboard-only tab navigation:
> - Ctrl+Shift+L / Ctrl+Shift+H — switch to the next / previous tab
> - Ctrl+Shift+. / Ctrl+Shift+, — move the current tab right / left
> - "Switch to most recent tab" — jump to the last tab you used (alt-tab style)
>
> All shortcuts are remappable at chrome://extensions/shortcuts. Navigation
> wraps around and works within the current window. No data ever leaves your
> browser.

**Category:** Productivity

## Privacy / permissions justification

The store requires a justification for each requested permission.

| Permission | Justification |
|------------|---------------|
| `tabs` | Read the active tab and the tab list to compute which tab to activate or move. The extension reads only tab identity and order — never page content or URLs for transmission. |
| `storage` | Persist the most-recently-used tab ordering in `chrome.storage.session` so the alt-tab feature survives the service worker restarting. Session-scoped; cleared when the browser closes. |

**Data usage disclosures:** This extension does **not** collect, transmit, or
sell any user data. All processing is local to the browser. Select "does not
collect user data" / no remote code on the privacy tab.

## Pre-submission checklist

- [ ] `npm run lint` clean
- [ ] `npm test` green
- [ ] `npm run build` succeeds; inspect the zip with `unzip -l`
- [ ] `version` bumped in `manifest.json`
- [ ] Loaded the built zip unpacked and exercised all shortcuts
- [ ] 128×128 icon present (store listing icon)
- [ ] At least one 1280×800 or 640×400 screenshot prepared
