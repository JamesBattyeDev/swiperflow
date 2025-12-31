import type { SwiperOptions } from 'swiper/types/swiper-options';
import { parseStringOrNumberAttr } from '../helpers/attributeParser';

// Default configuration values
const DEFAULTS = {
  slidesPerView: 1,
} as const;

/**
 * Generates Swiper breakpoint parameters based on custom attributes of the provided HTML element.
 * @param {HTMLElement} list - The HTML element containing breakpoint attributes.
 * @returns {SwiperOptions['breakpoints']} - An object containing Swiper breakpoint configurations.
 */
export function getBreakpointParams(list: HTMLElement): SwiperOptions['breakpoints'] {
  const breakpointParams: SwiperOptions['breakpoints'] = {};

  // Check for desktop breakpoint attribute and set the corresponding Swiper option
  if (list.dataset.swfBpDesktop) {
    breakpointParams['991'] = {
      slidesPerView: parseStringOrNumberAttr(list, 'bpDesktop', DEFAULTS.slidesPerView),
    };
  }

  // Check for tablet breakpoint attribute and set the corresponding Swiper option
  if (list.dataset.swfBpTablet) {
    breakpointParams['568'] = {
      slidesPerView: parseStringOrNumberAttr(list, 'bpTablet', DEFAULTS.slidesPerView),
    };
  }

  // Check for mobile breakpoint attribute and set the corresponding Swiper option
  if (list.dataset.swfBpMobile) {
    breakpointParams['320'] = {
      slidesPerView: parseStringOrNumberAttr(list, 'bpMobile', DEFAULTS.slidesPerView),
    };
  }

  return breakpointParams;
}
