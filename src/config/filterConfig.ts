import type Swiper from 'swiper';

/**
 * Initializes a MutationObserver to monitor changes in the child elements of a given list.
 * When changes are detected, the Swiper instance is updated accordingly.
 *
 * @param swiper - The Swiper instance to update.
 * @param list - The HTML element (list) to observe for mutations.
 */
export const initializeSwiperObserver = (swiper: Swiper, list: HTMLElement) => {
  // Store the initial number of child elements in the list
  let initialChildCount = list.children.length;

  // Configuration options for the MutationObserver
  const config = { childList: true, subtree: false };

  /**
   * Callback function executed when mutations are observed.
   * It checks if the number of child elements has changed and updates the Swiper instance if necessary.
   *
   * @param mutationsList - An array of MutationRecord objects representing the mutations that were observed.
   */
  const callback = function (mutationsList: MutationRecord[]) {
    let shouldUpdate = false;

    // Iterate through the list of mutations
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const currentChildCount = list.children.length;
        // Check if the number of child elements has changed
        if (currentChildCount !== initialChildCount) {
          shouldUpdate = true;
          initialChildCount = currentChildCount; // Update the initial count
          break;
        }
      }
    }


    // Update the Swiper instance if changes were detected
    if (shouldUpdate) {
      swiper.update();
    }
  };

  // Create a MutationObserver instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node (list) for configured mutations
  observer.observe(list, config);
};
