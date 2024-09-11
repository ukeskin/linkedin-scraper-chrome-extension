document.getElementById("scrapeButton").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

document.getElementById("startButton").addEventListener("click", function () {
  const limit = document.getElementById("limitInput").value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "scrape",
      limit: parseInt(limit),
    });
  });
  document.getElementById("status").textContent = "Scraping in progress...";
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "scrapeComplete") {
    document.getElementById("status").textContent = "Scraping complete!";
  }
});
