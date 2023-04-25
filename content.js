function blockVerifiedTweets() {
    // Find all instances of the <svg> element with the "Verified account" aria-label
    const svgElements = document.querySelectorAll('svg[aria-label="Verified account"]');
  
    // Loop through each <svg> element and replace the content of the corresponding <div> element with whitespace
    svgElements.forEach(svgElement => {
      const tweetTextElement = svgElement.closest('[data-testid="tweet"]')?.querySelector('[data-testid="tweetText"]');
      if (tweetTextElement) {
        tweetTextElement.textContent = '';
  
        // Hide the tweet user avatar element
        const tweetUserAvatarElement = tweetTextElement.closest('[data-testid="tweet"]').querySelector('[data-testid="Tweet-User-Avatar"]');
        if (tweetUserAvatarElement) {
          tweetUserAvatarElement.style.display = 'none';
        }
  
        // Hide any images posted by the same user
        const tweetImageElements = tweetTextElement.closest('[data-testid="tweet"]').querySelectorAll('img[src^="https://pbs.twimg.com/media/"][alt="Image"][draggable="true"]');
        tweetImageElements.forEach(tweetImageElement => {
          tweetImageElement.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='); // small transparent image
          tweetImageElement.setAttribute('data-src', tweetImageElement.getAttribute('src'));
        });
  
        // Remove the background image from any <div> elements with a background-image property
        const tweetMediaElements = tweetTextElement.closest('[data-testid="tweet"]').querySelectorAll('div[style*="background-image"]');
        tweetMediaElements.forEach(tweetMediaElement => {
          tweetMediaElement.style.backgroundImage = 'none';
        });
      }
    });
    function resizeVideoComponent() {
        const videoComponent = document.querySelector('div[data-testid="videoComponent"]');
        if (videoComponent) {
          videoComponent.style.height = '0';
          videoComponent.style.width = '0';
        }
      }
      
      // Call the function immediately
      resizeVideoComponent();
      
      // Call the function every 5 seconds
      setInterval(resizeVideoComponent, 1000);
      
  }
  
  // Call the function immediately
  blockVerifiedTweets();
  
  // Call the function every 5 seconds
  setInterval(blockVerifiedTweets, 1000);
  