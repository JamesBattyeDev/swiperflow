/**
 * Retrieves navigation parameters for a given component.
 *
 * @param component - The HTML element representing the component.
 * @returns An object containing navigation parameters.
 */
export function getNavigationParams(component: HTMLElement) {
  // Initialize an empty object to hold navigation parameters
  let navigationParams = {};

  // Check if the component contains a navigation element
  if (component.querySelector("[yc-slider-element='navigation']")) {
    // Select the navigation element
    const nav = component.querySelector<HTMLElement>(`[yc-slider-element='navigation']`);
    if (!nav) {
      // Log an error if the navigation element is not found
      console.error('No nav wrapper element on the page.');
      return {};
    }

    // Select the next arrow element within the navigation element
    const nextArrow = nav.querySelector<HTMLElement>(`[yc-slider-element='next-arrow']`);
    if (!nextArrow) {
      // Log an error if the next arrow element is not found
      console.error('no nextArrow');
      return {};
    }

    // Select the previous arrow element within the navigation element
    const prevArrow = nav.querySelector<HTMLElement>(`[yc-slider-element='prev-arrow']`);
    if (!prevArrow) {
      // Log an error if the previous arrow element is not found
      console.error('no prevArrow');
      return {};
    }

    // Set the navigation parameters with the next and previous arrow elements
    navigationParams = {
      nextEl: nextArrow,
      prevEl: prevArrow,
    };
  } else {
    // If no navigation element is found, disable navigation
    navigationParams = {
      enabled: false,
    };
  }

  // Return the navigation parameters
  return navigationParams;
}
