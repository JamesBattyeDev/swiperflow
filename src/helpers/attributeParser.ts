/**
 * Attribute Parser Helpers
 *
 * Utility functions to parse HTML dataset attributes with type safety and default values.
 * All functions expect dataset keys in camelCase without the 'swf' prefix.
 *
 * Example:
 * HTML: <div data-swf-speed="600">
 * Usage: parseNumberAttr(element, 'speed', 400) // returns 600
 */

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parse boolean attribute from dataset
 * @param element - HTML element with dataset
 * @param key - dataset key (camelCase, without 'swf' prefix)
 * @param defaultValue - default boolean value
 * @returns parsed boolean value
 *
 * @example
 * // HTML: <div data-swf-loop="true">
 * parseBooleanAttr(element, 'loop', false) // returns true
 */
export function parseBooleanAttr(
  element: HTMLElement,
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = element.dataset[`swf${capitalize(key)}`];
  if (value === undefined) return defaultValue;
  return value === 'true';
}

/**
 * Parse number attribute from dataset
 * @param element - HTML element with dataset
 * @param key - dataset key (camelCase, without 'swf' prefix)
 * @param defaultValue - default number value
 * @returns parsed number value
 *
 * @example
 * // HTML: <div data-swf-speed="600">
 * parseNumberAttr(element, 'speed', 400) // returns 600
 */
export function parseNumberAttr(
  element: HTMLElement,
  key: string,
  defaultValue: number = 0
): number {
  const value = element.dataset[`swf${capitalize(key)}`];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse string attribute from dataset
 * @param element - HTML element with dataset
 * @param key - dataset key (camelCase, without 'swf' prefix)
 * @param defaultValue - default string value
 * @returns parsed string value
 *
 * @example
 * // HTML: <div data-swf-active-class="active">
 * parseStringAttr(element, 'activeClass', 'swiper-slide-active') // returns 'active'
 */
export function parseStringAttr(
  element: HTMLElement,
  key: string,
  defaultValue: string = ''
): string {
  return element.dataset[`swf${capitalize(key)}`] ?? defaultValue;
}

/**
 * Parse string or number attribute (for values like 'auto' or numeric)
 * @param element - HTML element with dataset
 * @param key - dataset key (camelCase, without 'swf' prefix)
 * @param defaultValue - default value
 * @returns parsed value as string or number
 *
 * @example
 * // HTML: <div data-swf-visible="auto">
 * parseStringOrNumberAttr(element, 'visible', 1) // returns 'auto'
 *
 * // HTML: <div data-swf-visible="3">
 * parseStringOrNumberAttr(element, 'visible', 1) // returns 3
 */
export function parseStringOrNumberAttr(
  element: HTMLElement,
  key: string,
  defaultValue: string | number = 1
): string | number {
  const value = element.dataset[`swf${capitalize(key)}`];
  if (value === undefined) return defaultValue;
  if (value === 'auto') return 'auto';
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
