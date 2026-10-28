// Issues and pull requests share one number sequence per repo, and /issues/N redirects to /pull/N for a PR,
// so the key leaves out which kind it is.
const ITEM_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:pull|issues)\/(\d+)/i;

// A tab whose last page was one of these has no history worth keeping, so closing it is safe.
const BLANK_RE = /^(about:blank|chrome:\/\/newtab\/?|chrome:\/\/new-tab-page\/?)$/;

function parseItem(url) {
  const m = url && ITEM_RE.exec(url);
  if (!m) return null;
  return {
    key: `${m[1]}/${m[2]}/${m[3]}`.toLowerCase(),
    // Anything after /pull/N: a subpage (/files) or a deep link to a comment (#discussion_r…).
    rest: url.slice(m[0].length).replace(/^\/$/, ""),
  };
}

const committedKey = (tabId) => `committed:${tabId}`;
const byMostRecent = (a, b) => (b.lastAccessed ?? 0) - (a.lastAccessed ?? 0);

async function isPaused() {
  const { paused } = await chrome.storage.local.get("paused");
  return Boolean(paused);
}

async function setPaused(paused) {
  await chrome.storage.local.set({ paused });
  await chrome.action.setBadgeText({ text: paused ? "OFF" : "" });
}

async function closeDuplicates() {
  const tabs = await chrome.tabs.query({ url: "https://github.com/*" });
  const seen = new Set();
  const toClose = [];
  for (const tab of tabs.sort(byMostRecent)) {
    const item = parseItem(tab.url);
    if (!item) continue;
    if (seen.has(item.key)) toClose.push(tab.id);
    else seen.add(item.key);
  }
  if (toClose.length) await chrome.tabs.remove(toClose);
  return toClose.length;
}

async function rememberAllTabs() {
  const tabs = await chrome.tabs.query({});
  const entries = Object.fromEntries(tabs.filter((t) => t.url).map((t) => [committedKey(t.id), t.url]));
  await chrome.storage.session.set(entries);
}

async function onBrowserReady() {
  // Without this, tabs that were open before install look blank and an in-place click in them would be closed.
  await rememberAllTabs();
  await setPaused(await isPaused());
}

chrome.runtime.onInstalled.addListener(onBrowserReady);
chrome.runtime.onStartup.addListener(onBrowserReady);

chrome.commands.onCommand.addListener((command) => {
  if (command === "close-duplicates") closeDuplicates();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "close-duplicates") {
    closeDuplicates().then((closed) => sendResponse({ closed }));
    return true;
  }
  if (message.type === "set-paused") {
    setPaused(message.paused).then(() => sendResponse({}));
    return true;
  }
});

chrome.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
  if (frameId !== 0) return;
  chrome.storage.session.set({ [committedKey(tabId)]: url });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(committedKey(tabId));
});

chrome.webNavigation.onBeforeNavigate.addListener(async ({ tabId, frameId, url }) => {
  if (frameId !== 0) return;
  const item = parseItem(url);
  if (!item || (await isPaused())) return;

  const stored = await chrome.storage.session.get(committedKey(tabId));
  const previous = stored[committedKey(tabId)];
  if (previous && !BLANK_RE.test(previous)) return;

  const tabs = await chrome.tabs.query({ url: "https://github.com/*" });
  const existing = tabs.filter((t) => t.id !== tabId && parseItem(t.url)?.key === item.key).sort(byMostRecent)[0];
  if (!existing) return;

  const update = { active: true };
  // A bare link only switches tabs; a link to a subpage or comment also takes the existing tab there.
  if (item.rest && url !== existing.url) update.url = url;

  await chrome.tabs.update(existing.id, update);
  await chrome.windows.update(existing.windowId, { focused: true });
  await chrome.tabs.remove(tabId);
});
