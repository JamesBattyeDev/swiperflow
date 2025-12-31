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

import { logger } from "./logger";

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
  const datasetKey = `swf${capitalize(key)}`;
  const value = element.dataset[datasetKey];
  logger.log(`parseBooleanAttr: key="${key}", datasetKey="${datasetKey}", value="${value}", default="${defaultValue}"`);
  if (value === undefined) {
    logger.log(`  → undefined, returning default: ${defaultValue}`);
    return defaultValue;
  }
  const result = value === 'true';
  logger.log(`  → parsed to: ${result}`);
  return result;
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
  const datasetKey = `swf${capitalize(key)}`;
  const value = element.dataset[datasetKey];
  logger.log(`parseNumberAttr: key="${key}", datasetKey="${datasetKey}", value="${value}", default="${defaultValue}"`);
  if (value === undefined) {
    logger.log(`  → undefined, returning default: ${defaultValue}`);
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  const result = isNaN(parsed) ? defaultValue : parsed;
  logger.log(`  → parsed to: ${result} (isNaN: ${isNaN(parsed)})`);
  return result;
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
  const datasetKey = `swf${capitalize(key)}`;
  const value = element.dataset[datasetKey];
  const result = value ?? defaultValue;
  logger.log(`parseStringAttr: key="${key}", datasetKey="${datasetKey}", value="${value}", default="${defaultValue}", result="${result}"`);
  return result;
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
  const datasetKey = `swf${capitalize(key)}`;
  const value = element.dataset[datasetKey];
  logger.log(`parseStringOrNumberAttr: key="${key}", datasetKey="${datasetKey}", value="${value}", default="${defaultValue}"`);
  if (value === undefined) {
    logger.log(`  → undefined, returning default: ${defaultValue}`);
    return defaultValue;
  }
  if (value === 'auto') {
    logger.log(`  → returning "auto"`);
    return 'auto';
  }
  const parsed = parseInt(value, 10);
  const result = isNaN(parsed) ? defaultValue : parsed;
  logger.log(`  → parsed to: ${result} (isNaN: ${isNaN(parsed)})`);
  return result;
}
