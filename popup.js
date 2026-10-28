const closeButton = document.getElementById("close");
const status = document.getElementById("status");
const pausedBox = document.getElementById("paused");

async function showShortcut() {
  const commands = await chrome.commands.getAll();
  const shortcut = commands.find((c) => c.name === "close-duplicates")?.shortcut;
  status.replaceChildren();
  if (!shortcut) return;
  const key = document.createElement("kbd");
  key.textContent = shortcut;
  status.append("Shortcut ", key);
}

closeButton.addEventListener("click", async () => {
  closeButton.disabled = true;
  const { closed } = await chrome.runtime.sendMessage({ type: "close-duplicates" });
  status.textContent = closed ? `Closed ${closed} ${closed === 1 ? "tab" : "tabs"}` : "No duplicates open";
  closeButton.disabled = false;
});

pausedBox.addEventListener("change", () => {
  chrome.runtime.sendMessage({ type: "set-paused", paused: pausedBox.checked });
});

chrome.storage.local.get("paused").then(({ paused }) => {
  pausedBox.checked = Boolean(paused);
});
showShortcut();
