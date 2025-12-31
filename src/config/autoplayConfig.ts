import { parseBooleanAttr, parseNumberAttr } from '../helpers/attributeParser';

// Default configuration values
const DEFAULTS = {
  enabled: false,
  delay: 4000,
} as const;

/**
 * Retrieves autoplay parameters from a given HTML element.
 *
 * @param {HTMLElement} list - The HTML element to extract autoplay parameters from.
 * @returns {Object} An object containing autoplay parameters.
 */
export function getAutoplayParams(list: HTMLElement) {
  const enabled = parseBooleanAttr(list, 'autoplay', DEFAULTS.enabled);

  if (enabled) {
    return {
      enabled: true,
      delay: parseNumberAttr(list, 'autoplayDelay', DEFAULTS.delay),
    };
  }

  return {
    enabled: false,
  };
}
