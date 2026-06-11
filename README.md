# Tab Switcher

A minimal Chrome (Manifest V3) extension that adds Vim-style keyboard shortcuts for cycling between browser tabs.

## Features

| Action | Shortcut | Vim mnemonic |
|--------|----------|--------------|
| Switch to next tab | `Ctrl+Shift+L` | `l` = right |
| Switch to previous tab | `Ctrl+Shift+H` | `h` = left |
| Move current tab right | `Ctrl+Shift+.` | `>` = shift right |
| Move current tab left | `Ctrl+Shift+,` | `<` = shift left |
| Switch to most recent tab | _(unassigned)_ | "alt-tab" |

The first four actions wrap around (next from the last tab goes to the first, etc.) and operate within the current window. On macOS the same bindings use the literal **Control** key (`MacCtrl`), not Command, for cross-platform consistency.

The **most recent tab** command is an "alt-tab"-style jump to the last tab you used. Chrome allows at most four suggested keyboard shortcuts and all four are taken, so this command ships **without a default shortcut** — assign one yourself at `chrome://extensions/shortcuts`. The most-recently-used ordering is tracked from tab activation/removal events and persisted in `chrome.storage.session` so it survives the service worker restarting.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select this directory.

To change the shortcuts, visit `chrome://extensions/shortcuts`.

## Development

The decision logic lives in [`tab-switch.js`](tab-switch.js) as pure functions (`computeTargetIndex` and the `updateMru` / `removeFromMru` / `getMostRecentTabId` helpers), isolated from the `chrome.*` API so they can be unit-tested. [`background.js`](background.js) is a thin service-worker listener that wires the Chrome APIs to those functions.

```bash
npm install      # install dev dependencies (Vitest, ESLint)
npm test         # run the test suite once
npm run test:watch
npm run lint     # static analysis
npm run build    # package a versioned zip for the Chrome Web Store
```

## Packaging

`npm run build` runs [`scripts/build.sh`](scripts/build.sh), which zips only the
runtime files into `tab-switcher-<version>.zip` for upload. See
[`docs/STORE.md`](docs/STORE.md) for the full submission checklist, listing copy,
and permission justifications.

## Project layout

| File | Role |
|------|------|
| `manifest.json` | Extension config: permissions, service worker, keyboard commands, icons |
| `background.js` | Service worker — command listener + MRU tracking (glue) |
| `tab-switch.js` | Pure decision logic (index math + MRU helpers) |
| `tab-switch.test.js` | Unit tests |
| `scripts/build.sh` | Packages the runtime files into a store zip |
| `docs/STORE.md` | Chrome Web Store submission reference |
| `icon*.png` / `icon.svg` | Extension icons |

## License

[MIT](LICENSE)
