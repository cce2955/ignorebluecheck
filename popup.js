document.addEventListener('DOMContentLoaded', () => {
  const userHandleInput = document.getElementById('userHandleInput');
  const addUserHandleButton = document.getElementById('addUserHandleButton');
  const whitelistElement = document.getElementById('whitelist');

  console.log('Whitelist element:', whitelistElement);
  console.log(whitelistElement); // Check if the element is correctly referenced

  const loadWhitelist = () => {
    console.log('Loading Whitelist');
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      // Clear the existing whitelist
      whitelistElement.innerHTML = '';
  
      // Render each whitelist item
      whitelist.forEach((handle) => {
        console.log('Adding handle:', handle);
        const listItem = document.createElement('li');
        listItem.textContent = handle;
        listItem.classList.add('visible');
  
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.classList.add('glossy-btn');
        removeButton.addEventListener('click', () => {
          removeUserFromWhitelist(handle);
        });
        listItem.appendChild(removeButton);
  
        whitelistElement.appendChild(listItem);
      });
    });
  };
  
  

  const removeUserFromWhitelist = (userHandle) => {
    console.log('Removing user handle:', userHandle);
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      const updatedWhitelist = whitelist.filter((handle) => handle !== userHandle);
      chrome.storage.local.set({ whitelist: updatedWhitelist }, () => {
        const listItem = whitelistElement.querySelector(`li:contains(${userHandle})`);
        if (listItem) {
          listItem.classList.remove('visible');
          setTimeout(() => {
            listItem.remove();
            loadWhitelist();
          }, 500);
        }
      });
    });
  };

  addUserHandleButton.addEventListener('click', () => {
    const userHandle = userHandleInput.value;
    console.log('Adding user handle:', userHandle);
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
