/**
 * Content script for the Chrome extension.
 * This script communicates with the background script and interacts with the webpage.
 */

/**
 * Listener for incoming messages from the background script.
 * Handles the 'requestWhitelist' action by sending the current whitelist data.
 *
 * @param {Object} request - The incoming message object.
 * @param {Object} sender - Information about the sender of the message.
 * @param {Function} sendResponse - A callback function to send a response asynchronously.
 * @returns {boolean} - True to indicate that a response will be sent asynchronously.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

/**
 * Listener for tab updates.
 * Sends a message to the content script when a page is loading.
 *
 * @param {number} tabId - The ID of the updated tab.
 * @param {Object} changeInfo - Information about the tab status change.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    console.log('Page loading, sending message to content script');
    chrome.tabs.sendMessage(tabId, { action: 'waitForContentLoaded' });
  }
});

/**
 * Listener for incoming messages from the content script.
 * Handles the 'contentScriptReady' action by sending the current whitelist data to the content script.
 *
 * @param {Object} request - The incoming message object.
 * @param {Object} sender - Information about the sender of the message.
 */
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
