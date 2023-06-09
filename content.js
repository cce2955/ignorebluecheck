/**
 * The CSS selector for the checkmark icon element.
 * Used to identify the presence of a verified account.
 */
const checkmarkSelector = 'svg[data-testid="icon-verified"]';
console.log('checkmarkSelector:', checkmarkSelector);

/**
 * The whitelist of user handles.
 * User handles can be added to this whitelist to determine which elements should be removed.
 */
let whitelist = [];
console.log('whitelist:', whitelist);

/**
 * The current state of the extension.
 * Indicates whether the extension is enabled or disabled.
 */
let isEnabled = true;
console.log('isEnabled:', isEnabled);

/**
 * Fetches the whitelist and state from storage (if available) and stores them in memory.
 * If chrome.storage is not available, an error is logged.
 */
if (chrome.storage) {
  chrome.storage.local.get(['whitelist', 'isEnabled'], (storageData) => {
    whitelist = storageData.whitelist || [];
    isEnabled = storageData.isEnabled !== undefined ? storageData.isEnabled : true;
    console.log('Fetched whitelist from storage:', whitelist);
    console.log('Fetched isEnabled from storage:', isEnabled);

    // Call updateContent function to apply initial changes based on the state
    updateContent(isEnabled);
  });
} else {
  console.error('chrome.storage is not available');
}

/**
 * Listens for messages from the popup.js file.
 * Handles requests to update the state of the extension.
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'updateState') {
    // Update the content based on the updated state
    updateContent(message.isEnabled);
  }
});

/**
 * Updates the content based on the state of the extension.
 *
 * @param {boolean} isEnabled - The current state of the extension (true if enabled, false if disabled).
 */
function updateContent(isEnabled) {
  if (isEnabled) {
    // Apply changes when the state is true (button is "on")
    console.log('Button is currently "on". Applying changes...');
    
  } else {
    // Apply changes when the state is false (button is "off")
    console.log('Button is currently "off". Applying changes...');
    
  }
}

/**
 * Listens for incoming messages from the background script or popup.
 * Handles requests for data and updates to the whitelist.
 *
 * @param {Object} request - The incoming message object.
 * @param {Object} sender - Information about the sender of the message.
 * @param {Function} sendResponse - A callback function to send a response asynchronously.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'request_data') {
    // Responds to a request for whitelist data by sending the current whitelist.
    const data = whitelist;
    console.log('Sending whitelist data:', data);
    sendResponse({ data });
  } else if (request.type === 'update_whitelist') {
    // Updates the whitelist with the provided data and sends a success response.
    whitelist = request.whitelist;
    isEnabled = request.isEnabled;
    console.log('Whitelist updated:', whitelist);
    console.log('isEnabled updated:', isEnabled);
    sendResponse({ success: true });
  }
});
/**
 * Determines whether an element should be removed based on the container, username, checkmark presence, and whitelist.
 *
 * @param {Element} container - The container element containing the element to be checked.
 * @param {string} username - The username associated with the element.
 * @returns {boolean} - True if the element should be removed, false otherwise.
 */
const shouldRemove = (container, username) => {
  const checkmarkElement = container.querySelector(checkmarkSelector);
  const hasCheckmark = checkmarkElement != null;
  console.log('shouldRemove:', { container, username, hasCheckmark, whitelist });
  return (hasCheckmark && !whitelist.includes(username)) || (!hasCheckmark && whitelist.includes(username));
};

/**
 * Removes the background image for a specific username within a container element.
 *
 * @param {Element} container - The container element containing the background image.
 * @param {string} username - The username associated with the background image.
 */
const removeBackgroundImage = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing background image for', username);
    const imageDiv = container.querySelector('div[data-testid="tweetPhoto"]');
    if (imageDiv) {
      imageDiv.replaceChildren();
    }
  }
};

/**
 * Removes the user avatar for a specific username within a container element.
 *
 * @param {Element} container - The container element containing the user avatar.
 * @param {string} username - The username associated with the user avatar.
 */
const removeUserAvatar = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing user avatar for', username);
    const userAvatarDivs = container.querySelectorAll('div[data-testid="Tweet-User-Avatar"]');
    userAvatarDivs.forEach((avatarDiv) => {
      avatarDiv.replaceChildren();
    });
  }
};

/**
 * Removes the user description for a specific username within a container element.
 *
 * @param {Element} container - The container element containing the user description.
 * @param {string} username - The username associated with the user description.
 */
const removeUserDescription = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing user description for', username);
    const userDescriptionDivs = container.querySelectorAll('div[data-testid="UserDescription"]');
    userDescriptionDivs.forEach((descriptionDiv) => {
      descriptionDiv.replaceChildren();
    });
  }
};

/**
 * Removes the user avatar container for a specific username within a container element.
 *
 * @param {Element} container - The container element containing the user avatar container.
 * @param {string} username - The username associated with the user avatar container.
 */
const removeUserAvatarContainer = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing user avatar container for', username);
    const userAvatarContainerDivs = container.querySelectorAll('div[data-testid^="UserAvatar-Container-"]');
    userAvatarContainerDivs.forEach((avatarContainerDiv) => {
      avatarContainerDiv.replaceChildren();
    });
  }
};

/**
 * Removes the tweet text for a specific username within a container element.
 *
 * @param {Element} container - The container element containing the tweet text.
 * @param {string} username - The username associated with the tweet text.
 */
const removeTweetText = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing tweet text for', username);
    const tweetTextElements = container.querySelectorAll('[data-testid="tweetText"]');
    tweetTextElements.forEach((element) => {
      element.remove();
    });
  }
};

/**
 * Removes the children elements of the user name element for a specific username within a container element.
 *
 * @param {Element} container - The container element containing the user name element.
 * @param {string} username - The username associated with the user name element.
 */
const removeUserNameChildren = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing user name children for', username);
    const userNameElements = container.querySelectorAll('[data-testid="UserName"]');
    userNameElements.forEach((element) => {
      element.replaceChildren();
    });
  }
};

/**
 * Removes the children elements of the header photo element within a container element.
 *
 * @param {Element} container - The container element containing the header photo element.
 */
const removeHeaderPhotoChildren = (container) => {
  console.log('Removing header photo children');
  const headerPhotoElements = container.querySelectorAll('a[href*="/header_photo"]');
  headerPhotoElements.forEach((element) => {
    element.replaceChildren();
  });
};

/**
 * Removes the children elements of the photo elements for a specific username within a container element.
 *
 * @param {Element} container - The container element containing the photo elements.
 * @param {string} username - The username associated with the photo elements.
 */
const removePhotoChildren = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing photo children for', username);
    const photoElements = container.querySelectorAll('a[href*="/photo"]');
    photoElements.forEach((element) => {
      element.replaceChildren();
    });
  }
};
/**
 * A MutationObserver that triggers the extraction of usernames upon mutations.
 *
 * @param {MutationRecord[]} mutations - An array of mutation records.
 */
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    extractUsernames();
  });
});

/**
 * Starts observing the document for mutations and triggers the extraction of usernames.
 */
const startObserving = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOMContentLoaded, start observing');
      observer.observe(document.body, config);
    });
  } else {
    console.log('Start observing');
    observer.observe(document.body, config);
  }
};

startObserving();

/**
 * Extracts usernames from tweet elements in the document and checks them against the whitelist.
 * Blocks content for non-whitelisted users.
 */
const extractUsernames = () => {
  const tweetIds = document.querySelectorAll('[data-testid="tweet"]');
  console.log('extractUsernames - tweetIds:', tweetIds);

  tweetIds.forEach((tweetElement) => {
    const usernameElements = tweetElement.querySelectorAll('div[dir="ltr"] > span, div[dir="ltr"] ~ * > span');
    const usernames = new Set();
    console.log('extractUsernames - usernameElements:', usernameElements);

    for (const usernameElement of usernameElements) {
      const textContent = usernameElement.textContent;
      console.log('extractUsernames - usernameElement:', { textContent, usernameElement });
      if (textContent.includes('@')) {
        usernames.add(textContent);
      }
    }

    // Check usernames against the whitelist and block content for non-whitelisted users
    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
    console.log('extractUsernames - primaryColumn:', primaryColumn);
    usernames.forEach((username) => {
      if (!isEnabled) {
        return; // If blocking is disabled, skip content blocking
      }
      if (!isUserWhitelisted(username) || !isEnabled) {
        console.log('Blocking content for non-whitelisted user:', username);
        removeBackgroundImage(tweetElement, username);
        removePhotoChildren(tweetElement, username);
        removeTweetText(tweetElement, username);
        removeUserNameChildren(tweetElement, username);
        removeUserAvatar(tweetElement, username);
        removeHeaderPhotoChildren(primaryColumn);
        removeUserDescription(primaryColumn);
        removeUserAvatarContainer(primaryColumn);
      }
    });
    
    });
  }

/**
 * Checks if a username is whitelisted.
 *
 * @param {string} username - The username to check.
 * @returns {boolean} - True if the username is whitelisted, false otherwise.
 */
const isUserWhitelisted = (username) => {
  return whitelist.includes(username);
};

/**
 * Configuration options for the MutationObserver.
 */
const config = {
  childList: true,
  subtree: true,
};

/**
 * Listens for whitelist update messages from the extension.
 * Triggers the replacement of content with whitespace.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'whitelistUpdated') {
    console.log('Whitelist updated');
    isEnabled = request.isEnabled;
chrome.storage.local.set({ whitelist, isEnabled });
    replaceContentWithWhitespace();
  }
});

/**
 * Listens for content loaded messages from the extension.
 * Sends a response indicating that the content script is ready.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'waitForContentLoaded') {
    sendResponse({ action: 'contentScriptReady' });
  }
});
/**
 * Listens for content loaded messages from the extension.
 * Sends a response indicating that the content script is ready.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'contentLoaded') {
    console.log('Content loaded');
    sendResponse({ ready: true });
  }
});

/**
 * Replaces content with whitespace for non-whitelisted users.
 */
const replaceContentWithWhitespace = () => {
  const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
  console.log('replaceContentWithWhitespace - tweetElements:', tweetElements);
  tweetElements.forEach((tweetElement) => {
    const usernameElement = tweetElement.querySelector('div[dir="ltr"] > span');
    const username = usernameElement.textContent;
    console.log('replaceContentWithWhitespace - usernameElement:', usernameElement);
    if (!isUserWhitelisted(username) || !isEnabled) {
      tweetElement.innerHTML = '<div style="background-color: white; height: 100%;"></div>';
    }
  });
};