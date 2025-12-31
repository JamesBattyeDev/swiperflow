/**
 * Determines the direction of a given list element based on its attribute.
 *
 * @param {HTMLElement} list - The list element to check for direction.
 * @returns {'horizontal' | 'vertical'} - The direction of the list, defaults to 'horizontal' if not specified or invalid.
 */
export function getDirection(list: HTMLElement): 'horizontal' | 'vertical' {
  // Retrieve the 'yc-slider-direction' attribute from the list element.
  const directionAttr = list.getAttribute('yc-slider-direction') as 'horizontal' | 'vertical';

  // Check if the attribute value is either 'horizontal' or 'vertical'.
  // If valid, return the attribute value; otherwise, default to 'horizontal'.
  return ['horizontal', 'vertical'].includes(directionAttr) ? directionAttr : 'horizontal';
}
