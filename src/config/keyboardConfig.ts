import { parseBooleanAttr } from '../helpers/attributeParser';

// Default configuration values
const DEFAULTS = {
  enabled: true,
  onlyInViewport: true,
  pageUpDown: true,
} as const;

/**
 * Retrieves keyboard parameters from a given HTML element.
 *
 * @param {HTMLElement} list - The HTML element to extract keyboard parameters from.
 * @returns {Object} An object containing keyboard parameters.
 */
export function getKeyboardParams(list: HTMLElement) {
  const enabled = parseBooleanAttr(list, 'keyboard', DEFAULTS.enabled);

  if (enabled) {
    return {
      enabled: true,
      onlyInViewport: parseBooleanAttr(list, 'keyboardOnlyInViewport', DEFAULTS.onlyInViewport),
      pageUpDown: parseBooleanAttr(list, 'keyboardPageUpDown', DEFAULTS.pageUpDown),
    };
  }

  return {
    enabled: false,
  };
}
