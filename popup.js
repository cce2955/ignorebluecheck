document.addEventListener('DOMContentLoaded', () => {
    const userHandleInput = document.getElementById('userHandleInput');
    const addUserHandleButton = document.getElementById('addUserHandleButton');
    const whitelistElement = document.getElementById('whitelist');
  
    const loadWhitelist = () => {
      const whitelist = JSON.parse(localStorage.getItem('whitelist')) || [];
      console.log(whitelist); 
      whitelistElement.innerHTML = '';
      whitelist.forEach((handle) => {
        const listItem = document.createElement('li');
        listItem.textContent = handle;
        whitelistElement.appendChild(listItem);
      });
    };
  
    addUserHandleButton.addEventListener('click', () => {
      const userHandle = userHandleInput.value.trim();
      if (userHandle) {
        let whitelist = JSON.parse(localStorage.getItem('whitelist')) || [];
        if (!whitelist.includes(userHandle)) {
          whitelist.push(userHandle);
          localStorage.setItem('whitelist', JSON.stringify(whitelist));
          loadWhitelist();
          userHandleInput.value = '';
  
          // Send the updated whitelist array to content.js
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'arrayUpdated', data: whitelist });
          });
        }
      }
    });
  
    loadWhitelist();
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'requestWhitelist') {
      const whitelist = JSON.parse(localStorage.getItem('whitelist')) || [];
      sendResponse({ action: 'arrayUpdated', data: whitelist });
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
      const whitelist = JSON.parse(localStorage.getItem('whitelist')) || [];
      chrome.tabs.sendMessage(tabId, { action: 'sendWhitelist', data: whitelist });
    }
  });
  