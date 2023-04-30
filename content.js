const checkmarkSelector = 'svg[data-testid="icon-verified"]';

let whitelist = []; // Add user handles to the whitelist
if (chrome.storage) {
  // Fetch the whitelist from storage and store it in memory
  chrome.storage.local.get('whitelist', (storageData) => {
    whitelist = storageData.whitelist || [];
  });
} else {
  console.error('chrome.storage is not available');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'request_data') {
    const data = whitelist;
    sendResponse({ data });
  } else if (request.type === 'update_whitelist') {
    whitelist = request.whitelist;
    sendResponse({ success: true });
  }
});

const shouldRemove = (container, username) => {
  const checkmarkElement = container.querySelector(checkmarkSelector);
  const hasCheckmark = checkmarkElement != null;
  return (hasCheckmark && !whitelist.includes(username)) || (!hasCheckmark && whitelist.includes(username));
};

const removeBackgroundImage = (container, username) => {
  if (shouldRemove(container, username)) {
    const imageDiv = container.querySelector('div[data-testid="tweetPhoto"]');
    if (imageDiv) {
      imageDiv.replaceChildren();
    }
  }
};

const removeUserAvatar = (container, username) => {
  if (shouldRemove(container, username)) {
    const userAvatarDivs = container.querySelectorAll('div[data-testid="Tweet-User-Avatar"]');
    userAvatarDivs.forEach((avatarDiv) => {
      avatarDiv.replaceChildren();
    });
  }
};

const removeUserDescription = (container, username) => {
  if (shouldRemove(container, username)) {
    const userDescriptionDivs = container.querySelectorAll('div[data-testid="UserDescription"]');
    userDescriptionDivs.forEach((descriptionDiv) => {
      descriptionDiv.replaceChildren();
    });
  }
};

const removeUserAvatarContainer = (container, username) => {
  if (shouldRemove(container, username)) {
    const userAvatarContainerDivs = container.querySelectorAll('div[data-testid^="UserAvatar-Container-"]');
    userAvatarContainerDivs.forEach((avatarContainerDiv) => {
      avatarContainerDiv.replaceChildren();
    });
  }
};

const removeTweetText = (container, username) => {
  if (shouldRemove(container, username)) {
    const tweetTextElements = container.querySelectorAll('[data-testid="tweetText"]');
    tweetTextElements.forEach((element) => {
      element.remove();
    });
  }
};

const removeUserNameChildren = (container, username) => {
  if (shouldRemove(container, username)) {
    const userNameElements = container.querySelectorAll('[data-testid="UserName"]');
    userNameElements.forEach((element) => {
      element.replaceChildren();
    });
  }
};

const removeHeaderPhotoChildren = (container, username) => {
  if (shouldRemove(container, username)) {
    const headerPhotoElements = container.querySelectorAll('a[href*="/header_photo"]');
    headerPhotoElements.forEach((element) => {
      element.replaceChildren();
    });
  }
};

const removePhotoChildren = (container, username) => {
  if (shouldRemove(container, username)) {
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
      observer.observe(document.body, config);
    });
  } else {
    observer.observe(document.body, config);
  }
};

startObserving();

const extractUsernames = () => {
  const tweetIds = document.querySelectorAll('[data-testid="tweet"]');

  tweetIds.forEach((tweetElement) => {
    const usernameElements = tweetElement.querySelectorAll('div[dir="ltr"] > span');
    const usernames = new Set();

    for (const usernameElement of usernameElements) {
      const textContent = usernameElement.textContent;
      if (textContent.includes('@')) {
        usernames.add(textContent);
      }
    }

    // Check usernames against the whitelist and block content for non-whitelisted users
    
   
    usernames.forEach((username) => {
      if (!isUserWhitelisted(username)) {
        removeBackgroundImage(tweetElement, username); 
        removeHeaderPhotoChildren(tweetElement, username);
        removePhotoChildren(tweetElement, username);
        removeTweetText(tweetElement, username);
        removeUserNameChildren(tweetElement, username);
        removeUserAvatar(tweetElement, username);
        removeUserDescription(tweetElement, username);
        removeUserAvatarContainer(tweetElement, username);
        
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

observer.observe(document.body, config);



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'whitelistUpdated') {
    console.log('Whitelist updated'); 
    replaceContentWithWhitespace();
  }
});



