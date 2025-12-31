import type { SwiperOptions } from 'swiper/types/swiper-options';

/**
 * Generates Swiper breakpoint parameters based on custom attributes of the provided HTML element.
 * @param {HTMLElement} list - The HTML element containing breakpoint attributes.
 * @returns {SwiperOptions['breakpoints']} - An object containing Swiper breakpoint configurations.
 */
export function getBreakpointParams(list: HTMLElement): SwiperOptions['breakpoints'] {
  const breakpointParams: SwiperOptions['breakpoints'] = {};

  // Check for desktop breakpoint attribute and set the corresponding Swiper option
  if (list.getAttribute('yc-slider-breakpoint-desktop')) {

    breakpointParams['991'] = {
      slidesPerView:
        list.getAttribute('yc-slider-breakpoint-desktop') === 'auto'
          ? 'auto'
          : parseInt(list.getAttribute('yc-slider-breakpoint-desktop') || '1') || 1,
    };
  }

  // Check for tablet breakpoint attribute and set the corresponding Swiper option
  if (list.getAttribute('yc-slider-breakpoint-tablet')) {
    breakpointParams['568'] = {
      slidesPerView:
        list.getAttribute('yc-slider-breakpoint-tablet') === 'auto'
          ? 'auto'
          : parseInt(list.getAttribute('yc-slider-breakpoint-tablet') || '1') || 1,
    };
  }

  // Check for mobile breakpoint attribute and set the corresponding Swiper option
  if (list.getAttribute('yc-slider-breakpoint-mobile')) {

    breakpointParams['320'] = {
      slidesPerView:
        list.getAttribute('yc-slider-breakpoint-mobile') === 'auto'
          ? 'auto'
          : parseInt(list.getAttribute('yc-slider-breakpoint-mobile') || '1') || 1,
    };
  }

  return breakpointParams;
}
