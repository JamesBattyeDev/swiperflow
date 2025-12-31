import { parseStringAttr } from '../helpers/attributeParser';

// Default configuration values
const DEFAULTS = {
  direction: 'horizontal' as const,
} as const;

/**
 * Determines the direction of a given list element based on its attribute.
 *
 * @param {HTMLElement} list - The list element to check for direction.
 * @returns {'horizontal' | 'vertical'} - The direction of the list, defaults to 'horizontal' if not specified or invalid.
 */
export function getDirection(list: HTMLElement): 'horizontal' | 'vertical' {
  const directionAttr = parseStringAttr(list, 'direction', DEFAULTS.direction) as 'horizontal' | 'vertical';

  // Check if the attribute value is either 'horizontal' or 'vertical'.
  // If valid, return the attribute value; otherwise, default to 'horizontal'.
  return ['horizontal', 'vertical'].includes(directionAttr) ? directionAttr : 'horizontal';
}
