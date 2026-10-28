# GitHub tab dedupe

A Chrome extension that keeps one tab per GitHub pull request or issue.
When you open a pull request or issue that is already open, the new tab closes and Chrome switches to the existing one.

- A bare link (`/pull/123`) only switches tabs, so the existing tab stays on whatever page it was showing.
- A link to a subpage or comment (`/pull/123/files`, `#discussion_r…`) also moves the existing tab to that location.
- Only new or blank tabs are closed. Clicking a link inside a tab that already has a page leaves that tab alone, so you never lose back history.
- If the item is open in more than one tab, the one you used most recently wins.

## Toolbar menu

Click the extension icon to:

- **Close duplicate tabs** that are already open, keeping the most recently used copy of each. The shortcut is `Control+Shift+D` on macOS and `Alt+Shift+D` elsewhere; change it at `chrome://extensions/shortcuts`.
- **Pause tab switching.** The icon shows `OFF` while paused.

## Install

1. Clone this repo, or download it as a zip and unzip it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the folder.

To update, pull the latest changes and click the reload icon on the extension card.
