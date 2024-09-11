chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("linkedin.com/jobs/search")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } else {
    chrome.action.setPopup({ popup: "popup.html" });
  }
});
