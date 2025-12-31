/**
 * Retrieves autoplay parameters from a given HTML element.
 *
 * @param {HTMLElement} list - The HTML element to extract autoplay parameters from.
 * @returns {Object} An object containing autoplay parameters.
 */
export function getAutoplayParams(list: HTMLElement) {
  let autoplayParams = {};

  // Check if the 'yc-slider-autoplay' attribute is present
  if (list.getAttribute('yc-slider-autoplay') === "true") {
    // If present, enable autoplay and set the delay
    autoplayParams = {
      enabled: true,
      // Parse the delay attribute or default to 4000ms
      delay: parseInt(list.getAttribute('yc-slider-autoplay-delay') || '4000') || 4000,
    };
  } else {
    // If not present, disable autoplay
    autoplayParams = {
      enabled: false,
    };
  }

  return autoplayParams;
}
