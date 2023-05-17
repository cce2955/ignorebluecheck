cchrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'requestWhitelist') {
    console.log('Received request for whitelist');
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      console.log('Sending updated whitelist:', whitelist);
      sendResponse({ action: 'arrayUpdated', data: whitelist }); // Include the data property in the response
    });
    return true; // Make sure to return true to indicate you will send the response asynchronously
  }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    console.log('Page loading, sending message to content script');
    chrome.tabs.sendMessage(tabId, { action: 'waitForContentLoaded' });
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'contentScriptReady') {
    console.log('Content script ready, sending whitelist');
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      console.log('Sending whitelist to tab', sender.tab.id, ':', whitelist);
      chrome.tabs.sendMessage(sender.tab.id, { action: 'sendWhitelist', data: whitelist });
    });
  }
});
