document.addEventListener('DOMContentLoaded', () => {
    const userHandleInput = document.getElementById('userHandleInput');
    const addUserHandleButton = document.getElementById('addUserHandleButton');
    const whitelistElement = document.getElementById('whitelist');
  
    const loadWhitelist = () => {
      chrome.runtime.sendMessage({ action: 'requestWhitelist' }, (response) => {
        if (response.action === 'arrayUpdated') {
          const whitelist = response.data;
          
          whitelistElement.innerHTML = '';
          whitelist.forEach((handle) => {
            console.log('Adding handle:', handle);
            const listItem = document.createElement('li');
            listItem.textContent = handle;
      
            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remove';
            removeButton.classList.add('glossy-btn')
            removeButton.onclick = () => {
              removeUserFromWhitelist(handle);
            };
            listItem.appendChild(removeButton);
            whitelistElement.appendChild(listItem);
            setTimeout(() => {
                listItem.classList.add('visible');
              }, 100);
          });
        }
      });
    };
    
  
    const removeUserFromWhitelist = (userHandle) => {
        chrome.storage.local.get('whitelist', (data) => {
          const whitelist = data.whitelist || [];
          const updatedWhitelist = whitelist.filter((handle) => handle !== userHandle);
          chrome.storage.local.set({ whitelist: updatedWhitelist }, loadWhitelist);
          listItem.classList.remove('visible');
          setTimeout(() => {
            listItem.remove();
            loadWhitelist();
          }, 500);
        });
      };
      
      addUserHandleButton.addEventListener('click', () => {
        const userHandle = userHandleInput.value;
        chrome.storage.local.get('whitelist', (data) => {
          const whitelist = data.whitelist || [];
          whitelist.push(userHandle);
          chrome.storage.local.set({ whitelist: whitelist }, () => {
            loadWhitelist();
            userHandleInput.value = '';
          });
        });
      });
    loadWhitelist();
  });
  