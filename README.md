# GitHub tab dedupe

A Chrome extension that keeps one tab per GitHub pull request or issue.
When you open a pull request or issue that is already open, the new tab closes and Chrome switches to the existing one.

- A bare link (`/pull/123`) only switches tabs, so the existing tab stays on whatever page it was showing.
- A link to a subpage or comment (`/pull/123/files`, `#discussion_r…`) also moves the existing tab to that location.
- Only new or blank tabs are closed. Clicking a link inside a tab that already has a page leaves that tab alone, so you never lose back history.
- If the item is open in more than one tab, the one you used most recently wins.

It works the same for links from Slack, email, your terminal, or GitHub itself.

## Install with an AI agent

Paste this into Claude Code, or any coding agent that can run shell commands:

````text
Install the "GitHub tab dedupe" Chrome extension from https://github.com/sakce/gh-tab-dedupe for me.

1. If ~/gh-tab-dedupe exists, run `git pull` in it. Otherwise clone the repo there.
2. Read manifest.json, background.js, popup.html and popup.js. Confirm the extension
   only touches github.com tabs and makes no network requests. Stop and tell me if
   it does anything else.
3. Copy the absolute path of the folder to my clipboard.
4. Ask which Chromium browser I use (Chrome, Arc, Brave, Dia, Edge), and open its
   extensions page for me if you can.
5. Walk me through the steps you can't do for me, one at a time:
   - Turn on Developer mode (top right).
   - Click "Load unpacked". In the file picker, press Cmd+Shift+G (macOS) and paste
     the path from my clipboard. If the extension is already installed, click its
     reload icon instead.
   - Pin it from the puzzle-piece menu so the icon stays in the toolbar.
6. Tell me the keyboard shortcut for my OS from the README, and how to test it:
   open any GitHub pull request in two tabs and check that the second one closes.
````

Chrome doesn't let agents or scripts click **Load unpacked**, so those steps stay with you.

## Install by hand

```sh
git clone https://github.com/sakce/gh-tab-dedupe.git
```

Or [download the zip](https://github.com/sakce/gh-tab-dedupe/archive/refs/heads/main.zip) and unzip it. Then:

1. Open `chrome://extensions` and turn on **Developer mode** (top right).
2. Click **Load unpacked** and pick the folder.
3. Optional: pin the extension from the puzzle-piece menu so its icon stays in the toolbar.

It also works in other Chromium browsers, such as Arc, Brave, Dia and Edge.

## Toolbar menu

Click the extension icon to:

- **Close duplicate tabs** that are already open, keeping the most recently used copy of each.
- **Pause tab switching.** The icon shows `OFF` while paused, and stays paused after a browser restart.

## Keyboard shortcut

| | Shortcut |
| --- | --- |
| macOS | `⌃⇧D` (Control+Shift+D) |
| Windows and Linux | `Alt+Shift+D` |

The shortcut closes duplicate tabs without opening the menu.
Change it at `chrome://extensions/shortcuts`.

## Update

Pull the latest changes, then click the reload icon on the extension card in `chrome://extensions`.

A reload keeps your current shortcut, even if a newer version changes the default.
To pick up a new default, remove the extension and load it again, or set the shortcut at `chrome://extensions/shortcuts`.

## Permissions

| Permission | Why |
| --- | --- |
| `github.com` | Read the address of GitHub tabs to find duplicates. The extension doesn't read page content. |
| `tabs` | Switch to, update and close tabs. |
| `webNavigation` | See a link open before the page loads, so the duplicate closes before you see it. |
| `storage` | Remember the pause setting, and each tab's last page so a tab with history is never closed. |

Nothing leaves your browser. There's no network access, analytics or tracking.
