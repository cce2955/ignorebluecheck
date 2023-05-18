/**
 * This event listener is triggered when the DOM content is loaded.
 * It initializes the necessary variables and sets up event handlers.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get the input element for user handle
  const userHandleInput = document.getElementById('userHandleInput');

  // Get the button element for adding user handle
  const addUserHandleButton = document.getElementById('addUserHandleButton');

  // Get the element that represents the whitelist
  const whitelistElement = document.getElementById('whitelist');

  const switchButton = document.getElementById('switchButton');

  /**
   * This function updates the switch button state based on the stored isEnabled value.
   */
  const updateSwitchButtonState = (isEnabled) => {
    if (isEnabled) {
      switchButton.classList.add('on');
      switchButton.classList.remove('off');
      switchButton.textContent = 'On';
    } else {
      switchButton.classList.add('off');
      switchButton.classList.remove('on');
      switchButton.textContent = 'Off';
    }
  };

  /**
   * This function retrieves the isEnabled value from storage and updates the switch button state.
   */
  const loadButtonState = () => {
    // Retrieve the isEnabled value from local storage
    chrome.storage.local.get('isEnabled', (data) => {
      const isEnabled = data.isEnabled !== undefined ? data.isEnabled : true;
      updateSwitchButtonState(isEnabled);
    });
  };

  // Add event listener for the switch button click event
  switchButton.addEventListener('click', () => {
    switchButton.classList.toggle('on');
    switchButton.classList.toggle('off');

    if (switchButton.classList.contains('on')) {
      switchButton.textContent = 'On';
      // Store the boolean value in storage
      chrome.storage.local.set({ isEnabled: true });
      // Perform actions for the "on" state here
    } else {
      switchButton.textContent = 'Off';
      // Store the boolean value in storage
      chrome.storage.local.set({ isEnabled: false });
      // Perform actions for the "off" state here
    }
  });

  // Load the button state when the DOM is ready
  loadButtonState();

  /**
   * This function loads the whitelist from storage and renders it on the page.
   */
  const loadWhitelist = () => {
    console.log('Loading Whitelist');
  
    // Retrieve the whitelist from the local storage
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
  
      // Clear the existing whitelist
      whitelistElement.innerHTML = '';
  
      // Render each whitelist item
      whitelist.forEach((handle) => {
        console.log('Adding handle:', handle);
  
        // Create a list item element
        const listItem = document.createElement('li');
        listItem.textContent = handle;
        listItem.classList.add('visible');
  
        // Create a remove button for each list item
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.classList.add('glossy-btn');
        removeButton.dataset.userHandle = handle; // Store the user handle as a data attribute
  
        // Append the remove button to the list item
        listItem.appendChild(removeButton);
  
        // Append the list item to the whitelist element
        whitelistElement.appendChild(listItem);
      });
    });
  };
  
  // Add event listener for the remove button click event using event delegation
  whitelistElement.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const userHandle = event.target.dataset.userHandle;
      removeUserFromWhitelist(userHandle);
    }
  });
  
  /**
   * This function removes a user handle from the whitelist.
   *
   * @param {string} userHandle - The user handle to remove.
   */
  const removeUserFromWhitelist = (userHandle) => {
    console.log('Removing user handle:', userHandle);
  
    // Retrieve the whitelist from the local storage
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
  
      // Filter out the user handle to be removed
      const updatedWhitelist = whitelist.filter((handle) => handle !== userHandle);
  
      // Update the whitelist in the local storage
      chrome.storage.local.set({ whitelist: updatedWhitelist }, () => {
        // Find the corresponding list item in the DOM
        const listItems = whitelistElement.querySelectorAll('li');
        let listItemToRemove = null;
  
        listItems.forEach((listItem) => {
          if (listItem.textContent === userHandle) {
            listItemToRemove = listItem;
          }
        });
  
        if (listItemToRemove) {
          // Remove the list item with a fade-out effect
          listItemToRemove.classList.remove('visible');
          setTimeout(() => {
            listItemToRemove.remove();
            updatePopupWhitelist(updatedWhitelist); // Update the popup UI with the updated whitelist
          }, 500);
        } else {
          // If the list item is not found, still trigger the whitelist update in the popup UI
          updatePopupWhitelist(updatedWhitelist);
        }
      });
    });
  };
  
  
  /**
   * This function updates the popup UI with the provided whitelist.
   *
   * @param {string[]} updatedWhitelist - The updated whitelist.
   */
  const updatePopupWhitelist = (updatedWhitelist) => {
    // Clear the existing whitelist
    whitelistElement.innerHTML = '';
  
    // Render each whitelist item
    updatedWhitelist.forEach((handle) => {
      console.log('Adding handle:', handle);
  
      // Create a list item element
      const listItem = document.createElement('li');
      listItem.textContent = handle;
      listItem.classList.add('visible');
  
      // Create a remove button for each list item
      const removeButton = document.createElement('button');
      removeButton.innerText = 'Remove';
      removeButton.classList.add('glossy-btn');
      removeButton.dataset.userHandle = handle; // Store the user handle as a data attribute
  
      // Append the remove button to the list item
      listItem.appendChild(removeButton);
  
      // Append the list item to the whitelist element
      whitelistElement.appendChild(listItem);
    });
  };
  
  // Add event listener for the remove button click event using event delegation
  whitelistElement.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const userHandle = event.target.dataset.userHandle;
      removeUserFromWhitelist(userHandle);
    }
  });
  
  
  /**
   * Event listener for the add user handle button click event.
   * It adds a new user handle to the whitelist.
   */
  addUserHandleButton.addEventListener('click', () => {
    const userHandle = userHandleInput.value;
    console.log('Adding user handle:', userHandle);

    // Retrieve the whitelist from the local storage
    chrome.storage.local.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];

      // Add the new user handle to the whitelist
      whitelist.push(userHandle);

      // Update the whitelist in the local storage
      chrome.storage.local.set({ whitelist: whitelist }, () => {
        // Reload the whitelist and clear the input field
        loadWhitelist();
        userHandleInput.value = '';
      });
    });
  });

  // Load the whitelist when the DOM is ready
  loadWhitelist();
});
