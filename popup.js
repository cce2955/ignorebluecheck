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

        // Add event listener to remove the user handle
        removeButton.addEventListener('click', () => {
          removeUserFromWhitelist(handle);
        });

        // Append the remove button to the list item
        listItem.appendChild(removeButton);

        // Append the list item to the whitelist element
        whitelistElement.appendChild(listItem);
      });
    });
  };

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
        const listItem = whitelistElement.querySelector(`li:contains(${userHandle})`);

        if (listItem) {
          // Remove the list item with a fade-out effect
          listItem.classList.remove('visible');
          setTimeout(() => {
            listItem.remove();
            loadWhitelist();
          }, 500);
        }
      });
    });
  };

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
