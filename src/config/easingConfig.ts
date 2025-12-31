import { parseStringAttr } from '../helpers/attributeParser';
import { logger } from '../helpers/logger';

// Default configuration values
const DEFAULTS = {
  ease: 'ease-out',
} as const;

// Valid CSS easing keywords (lowercase for case-insensitive comparison)
const VALID_EASING_KEYWORDS = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
] as const;

/**
 * Applies CSS transition easing to the Swiper wrapper element.
 * Sets the --swiper-wrapper-transition-timing-function CSS variable.
 *
 * Supports:
 * - Standard CSS easing keywords: ease, ease-in, ease-out, ease-in-out, linear, none
 * - Custom cubic-bezier values: cubic-bezier(0.42, 0, 0.58, 1)
 *
 * @param {HTMLElement} wrapper - The wrapper element for the Swiper.
 * @param {HTMLElement} list - The list element containing the slides.
 * @returns {void}
 */
export function applyEasingConfig(
  wrapper: HTMLElement,
  list: HTMLElement
): void {

  // Parse the easing attribute
  const easingValue = parseStringAttr(list, 'ease', DEFAULTS.ease);

  logger.log('Parsed easing value:', easingValue);

  // Normalize to lowercase for case-insensitive comparison
  const normalizedValue = easingValue.toLowerCase();

  // Validate the easing value
  const isValidKeyword = VALID_EASING_KEYWORDS.includes(normalizedValue as any);
  const isCubicBezier = normalizedValue.startsWith('cubic-bezier(');

  // Determine the final value to apply
  let finalValue: string;

  if (isValidKeyword) {
    finalValue = normalizedValue;
  } else if (isCubicBezier) {
    // Basic validation for cubic-bezier
    if (!normalizedValue.endsWith(')')) {
      logger.warn(
        `Malformed cubic-bezier value: "${easingValue}". Missing closing parenthesis. Browser may ignore it.`
      );
    }
    finalValue = normalizedValue;
  } else {
    logger.warn(
      `Invalid easing value: "${easingValue}". Expected a valid CSS easing keyword or cubic-bezier function. Falling back to default: "${DEFAULTS.ease}"`
    );
    finalValue = DEFAULTS.ease;
  }

  // Apply the CSS variable to the wrapper
  list.style.setProperty(
    '--swiper-wrapper-transition-timing-function',
    finalValue
  );

  // Also set transition-timing-function directly on the list as a backup
  // (in case Swiper CSS is not imported)
  list.style.transition = `transform 3s ${finalValue}`;

  logger.log(
    `Applied easing "${finalValue}" to list via CSS variable and inline style`
  );
}
