chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'requestWhitelist') {
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      sendResponse({ action: 'arrayUpdated', data: whitelist });
    });
    return true; 
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      chrome.tabs.sendMessage(tabId, { action: 'sendWhitelist', data: whitelist });
    });
  }
});
