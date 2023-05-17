const checkmarkSelector = 'svg[data-testid="icon-verified"]';
console.log('checkmarkSelector:', checkmarkSelector);

let whitelist = []; // Add user handles to the whitelist
console.log('whitelist:', whitelist);
if (chrome.storage) {
  // Fetch the whitelist from storage and store it in memory
  chrome.storage.local.get('whitelist', (storageData) => {
    whitelist = storageData.whitelist || [];
    console.log('Fetched whitelist from storage:', whitelist);
  });
} else {
  console.error('chrome.storage is not available');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'request_data') {
    const data = whitelist;
    console.log('Sending whitelist data:', data);
    sendResponse({ data });
  } else if (request.type === 'update_whitelist') {
    whitelist = request.whitelist;
    console.log('Whitelist updated:', whitelist);
    sendResponse({ success: true });
  }
});

const shouldRemove = (container, username) => {
  const checkmarkElement = container.querySelector(checkmarkSelector);
  const hasCheckmark = checkmarkElement != null;
  console.log('shouldRemove:', { container, username, hasCheckmark, whitelist });
  return (hasCheckmark && !whitelist.includes(username)) || (!hasCheckmark && whitelist.includes(username));
};

const removeBackgroundImage = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing background image for', username);
    const imageDiv = container.querySelector('div[data-testid="tweetPhoto"]');
    if (imageDiv) {
      imageDiv.replaceChildren();
    }
  }
};

const removeUserAvatar = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing user avatar for', username);
    const userAvatarDivs = container.querySelectorAll('div[data-testid="Tweet-User-Avatar"]');
    userAvatarDivs.forEach((avatarDiv) => {
      avatarDiv.replaceChildren();
    });
  }
};

const removeUserDescription = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing user description for', username);
    const userDescriptionDivs = container.querySelectorAll('div[data-testid="UserDescription"]');
    userDescriptionDivs.forEach((descriptionDiv) => {
      descriptionDiv.replaceChildren();
    });
  }
};

const removeUserAvatarContainer = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing user avatar container for', username);
    const userAvatarContainerDivs = container.querySelectorAll('div[data-testid^="UserAvatar-Container-"]');
    userAvatarContainerDivs.forEach((avatarContainerDiv) => {
      avatarContainerDiv.replaceChildren();
    });
  }
};

const removeTweetText = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing tweet text for', username);
    const tweetTextElements = container.querySelectorAll('[data-testid="tweetText"]');
    tweetTextElements.forEach((element) => {
      element.remove();
    });
  }
};

const removeUserNameChildren = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing user name children for', username);
    const userNameElements = container.querySelectorAll('[data-testid="UserName"]');
    userNameElements.forEach((element) => {
      element.replaceChildren();
    });
  }
};

const removeHeaderPhotoChildren = (container) => {
  console.log('Removing header photo children');
  const headerPhotoElements = container.querySelectorAll('a[href*="/header_photo"]');
  headerPhotoElements.forEach((element) => {
    element.replaceChildren();
  });
};

const removePhotoChildren = (container, username) => {
  if (shouldRemove(container, username)) {
    console.log('Removing photo children for', username);
    const photoElements = container.querySelectorAll('a[href*="/photo"]');
    photoElements.forEach((element) => {
      element.replaceChildren();
    });
  }
};

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    extractUsernames();
  });
});

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
      if (!isUserWhitelisted(username)) {
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
};

const isUserWhitelisted = (username) => {
  return whitelist.includes(username);
};

const config = {
  childList: true,
  subtree: true,
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'whitelistUpdated') {
    console.log('Whitelist updated');
    replaceContentWithWhitespace();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'waitForContentLoaded') {
    sendResponse({ action: 'contentScriptReady' });
  }
});
