const checkmarkSelector = 'svg[data-testid="icon-verified"]';
const whitelist = []; // Add user handles to the whitelist

const getWhitelist = () => {
  return JSON.parse(localStorage.getItem('whitelist')) || [];
};

const isUserWhitelisted = (container) => {
  const userHandleElement = container.querySelector('div[dir="ltr"] > span');
  if (userHandleElement) {
    const userHandleText = userHandleElement.textContent;
    //console.log(userHandleText); 
    return getWhitelist().includes(userHandleText);
  }
  return false;
};

const removeBackgroundImage = (container) => {
  const imageDiv = container.querySelector('div[data-testid="tweetPhoto"]');
  if (imageDiv) {
    imageDiv.replaceChildren();
  }
};

const removeUserAvatar = (container) => {
  const userAvatarDivs = container.querySelectorAll('div[data-testid="Tweet-User-Avatar"]');
  userAvatarDivs.forEach((avatarDiv) => {
    avatarDiv.replaceChildren();
  });
};

const removeUserDescription = (container) => {
  const userDescriptionDivs = container.querySelectorAll('div[data-testid="UserDescription"]');
  userDescriptionDivs.forEach((descriptionDiv) => {
    // Perform additional operations on the descriptionDiv here
    descriptionDiv.replaceChildren();
  });
};

const removeUserAvatarContainer = (container) => {
  const userAvatarContainerDivs = container.querySelectorAll('div[data-testid^="UserAvatar-Container-"]');
  userAvatarContainerDivs.forEach((avatarContainerDiv) => {
    avatarContainerDiv.replaceChildren();
  });
};

const removeTweetText = (container) => {
  const tweetTextElements = container.querySelectorAll('[data-testid="tweetText"]');
  tweetTextElements.forEach((element) => {
    element.remove();
  });
};

const removeUserNameChildren = (container) => {
  const userNameElements = container.querySelectorAll('[data-testid="UserName"]');
  userNameElements.forEach((element) => {
    element.replaceChildren();
  });
};

const removeHeaderPhotoChildren = (container) => {
  const headerPhotoElements = container.querySelectorAll('a[href*="/header_photo"]');
  headerPhotoElements.forEach((element) => {
    element.replaceChildren();
  });
};

const removePhotoChildren = (container) => {
  const photoElements = container.querySelectorAll('a[href*="/photo"]');
  photoElements.forEach((element) => {
    element.replaceChildren();
  });
};


const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    replaceContentWithWhitespace();
  });
});
const replaceContentWithWhitespace = () => {
  const homeTimelineElement = document.querySelector('div[aria-label="Home timeline"]');

  if (homeTimelineElement) {
    const blueCheckmarks = homeTimelineElement.querySelectorAll(checkmarkSelector);

    if (blueCheckmarks.length > 0) {
      removeUserNameChildren(homeTimelineElement);
      removeHeaderPhotoChildren(homeTimelineElement);
      removePhotoChildren(homeTimelineElement);
      removeUserDescription(homeTimelineElement);
    }

    blueCheckmarks.forEach((checkmark) => {
      const articleElement = checkmark.closest('article');
      if (articleElement) {
        if (!isUserWhitelisted(articleElement)) {
          // Find and process the child elements within the <article> element only if the user is not whitelisted
          removeBackgroundImage(articleElement);
          removeTweetText(articleElement);
          removeUserAvatar(articleElement);
          removeUserDescription(articleElement);
          removeUserAvatarContainer(articleElement);
          removeHeaderPhotoChildren(articleElement);
          removePhotoChildren(articleElement);
        }
      }
    });
  }
};
const config = {
  childList: true,
  subtree: true,
};

observer.observe(document.body, config);

replaceContentWithWhitespace();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'whitelistUpdated') {
    console.log('Whitelist updated'); // Add this line to log that the message was received
    replaceContentWithWhitespace();
  }
});
