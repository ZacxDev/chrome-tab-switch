# Tab Switcher

A minimal Chrome (Manifest V3) extension that adds Vim-style keyboard shortcuts for cycling between browser tabs.

## Features

| Action | Shortcut | Vim mnemonic |
|--------|----------|--------------|
| Switch to next tab | `Ctrl+Shift+L` | `l` = right |
| Switch to previous tab | `Ctrl+Shift+H` | `h` = left |
| Move current tab right | `Ctrl+Shift+.` | `>` = shift right |
| Move current tab left | `Ctrl+Shift+,` | `<` = shift left |

All four actions wrap around (next from the last tab goes to the first, etc.) and operate within the current window. On macOS the same bindings use the literal **Control** key (`MacCtrl`), not Command, for cross-platform consistency.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select this directory.

To change the shortcuts, visit `chrome://extensions/shortcuts`.

## Development

The tab-index logic lives in [`tab-switch.js`](tab-switch.js) as a pure `computeNextIndex` function, isolated from the `chrome.*` API so it can be unit-tested. [`background.js`](background.js) is a thin service-worker listener that wires the Chrome APIs to that function.

```bash
npm install      # install dev dependencies (Vitest, ESLint)
npm test         # run the test suite once
npm run test:watch
npm run lint     # static analysis
```

## Project layout

| File | Role |
|------|------|
| `manifest.json` | Extension config: permissions, service worker, keyboard commands, icons |
| `background.js` | Service worker — command listener (glue) |
| `tab-switch.js` | Pure index logic (`computeNextIndex`) |
| `tab-switch.test.js` | Unit tests |
| `icon*.png` / `icon.svg` | Extension icons |

## License

[MIT](LICENSE)
