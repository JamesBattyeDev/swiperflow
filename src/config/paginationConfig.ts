import { getFirstWord } from '../helpers/getClassName';

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
  if (component.querySelector("[yc-slider-element='pagination']")) {
    // Select the pagination element
    const paginationElement = component.querySelector<HTMLElement>(
      `[yc-slider-element='pagination']`
    );
    if (!paginationElement) {
      // Log an error if the pagination element is not found
      console.error('no paginationElement');
      return {};
    }

    // Select the pagination dot element within the pagination element
    const paginationDot = paginationElement?.querySelector<HTMLElement>(
      "[yc-slider-element='pagination-dot']"
    );
    if (!paginationDot) {
      // Log an error if the pagination dot element is not found
      console.error('no paginationDot');
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
