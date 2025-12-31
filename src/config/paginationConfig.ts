import { getFirstWord } from '../helpers/getClassName';
import { logger } from '../helpers/logger';

/**
 * Generates pagination parameters for a given component.
 *
 * @param component - The HTML element representing the component.
 * @returns An object containing pagination parameters.
 */
export function getPaginationParams(component: HTMLElement) {
  // Initialize an empty object to hold pagination parameters
  let paginationParams = {};

  // Check if the component contains a pagination element
  if (component.querySelector("[swf-element='pagination']")) {
    // Select the pagination element
    const paginationElement = component.querySelector<HTMLElement>(
      `[swf-element='pagination']`
    );
    if (!paginationElement) {
      // Log an error if the pagination element is not found
      logger.error('No paginationElement found.');
      return {};
    }

    // Select the pagination dot element within the pagination element
    const paginationDot = paginationElement?.querySelector<HTMLElement>(
      "[swf-element='pagination-dot']"
    );
    if (!paginationDot) {
      // Log an error if the pagination dot element is not found
      logger.error('No paginationDot element found.');
      return {};
    }

    // Define the active class for pagination dots
    const paginationActiveClass = 'is-active';
    // Get the class name for pagination dots
    const paginationDotClass = getFirstWord(paginationDot);

    // Set the pagination parameters
    paginationParams = {
      el: paginationElement,
      bulletActiveClass: paginationActiveClass,
      bulletClass: paginationDotClass,
      bulletElement: 'button',
      clickable: true,
    };
  } else {
    // If no pagination element is found, disable pagination
    paginationParams = {
      enabled: false,
    };
  }

  // Return the pagination parameters
  return paginationParams;
}
