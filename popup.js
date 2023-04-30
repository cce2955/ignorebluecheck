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

      const removeButton = document.createElement('button');
      removeButton.innerText = 'Remove';
      removeButton.onclick = () => {
        removeUserFromWhitelist(handle);
      };
      listItem.appendChild(removeButton);
      whitelistElement.appendChild(listItem);
    });
  };

  const removeUserFromWhitelist = (userHandle) => {
    const whitelist = JSON.parse(localStorage.getItem('whitelist')) || [];
    const updatedWhitelist = whitelist.filter((handle) => handle !== userHandle);
    localStorage.setItem('whitelist', JSON.stringify(updatedWhitelist));
    loadWhitelist();
  };

  addUserHandleButton.addEventListener('click', () => {
    const userHandle = userHandleInput.value;
    const whitelist = JSON.parse(localStorage.getItem('whitelist')) || [];
    whitelist.push(userHandle);
    localStorage.setItem('whitelist', JSON.stringify(whitelist));
    loadWhitelist();
    userHandleInput.value = '';
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
  document.addEventListener('DOMContentLoaded', () => {
    const addUserHandleButton = document.getElementById('addUserHandleButton');
  
    addUserHandleButton.addEventListener('click', () => {
      const userHandleInput = document.getElementById('userHandleInput');
      const userHandle = userHandleInput.value;
  
      if (userHandle) {
        // Add user handle to the whitelist array in storage
        chrome.storage.local.get('whitelist', (storageData) => {
          const whitelist = storageData.whitelist || [];
          whitelist.push(userHandle);
          chrome.storage.local.set({ whitelist }, () => {
            // Send updated whitelist to content.js
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, { type: 'update_whitelist', whitelist }, (response) => {
                // Process the response from the content script, if needed
                console.log(response);
              });
            });
          });
        });
      }
    });
  });

  // popup.js
// popup.js
