import {
  A11y,
  Autoplay,
  Controller,
  EffectCards,
  EffectCreative,
  EffectFade,
  Navigation,
  Pagination,
} from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types/swiper-options';

import { getFirstWord } from '../helpers/getClassName';
import { getAutoplayParams } from './autoplayConfig';
import { getBreakpointParams } from './breakpointConfig';
import { getDirection } from './directionConfig';
import { getEffectsParams } from './effectsConfig';
import { getNavigationParams } from './navigationConfig';
import { getPaginationParams } from './paginationConfig';

// Function to generate the configuration for a Swiper instance based on the provided element
/**
 * Generates the configuration for a Swiper instance based on the provided element.
 * @param {HTMLElement} element - The main element containing the Swiper.
 * @param {HTMLElement} wrapper - The wrapper element for the Swiper.
 * @param {HTMLElement} list - The list element containing the slides.
 * @param {NodeListOf<HTMLElement>} item - The individual slide elements.
 * @returns {SwiperOptions} - The configuration object for Swiper.
 */
export function getSwiperConfig(
  element: HTMLElement,
  wrapper: HTMLElement,
  list: HTMLElement,
  item: NodeListOf<HTMLElement>,
  controller: boolean
): SwiperOptions {
  // Retrieve attribute-based configurations
  const navigationParams = getNavigationParams(element);
  const paginationParams = getPaginationParams(element);
  const autoplayParams = getAutoplayParams(list);
  const effectsParams = getEffectsParams(list);
  const breakpointParams = getBreakpointParams(list);
  const directionParams = getDirection(list);

  // Get list, wrapper and item classes
  const itemClass = getFirstWord(item[0]);
  const listClass = getFirstWord(list);

  // Duplicate slides if the attribute 'yc-slider-double-slides' is present
  if (list.getAttribute('yc-slider-double-slides')) {
    item.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      list.appendChild(clone);
    });
  }

  // Setting Swiper Parameters
  const swiperParams: SwiperOptions = {
    // Include Swiper modules
    modules: [
      Navigation,
      Pagination,
      Autoplay,
      EffectFade,
      Controller,
      EffectCards,
      EffectCreative,
      A11y,
    ],

    // Transition speed in milliseconds
    speed: parseInt(list.getAttribute('yc-slider-speed') || '400') || 400,

    // Space between slides in pixels
    spaceBetween: parseInt(list.getAttribute('yc-slider-slide-gap') || '0') || 0,

    // Number of slides visible at the same time
    slidesPerView:
      list.getAttribute('yc-slider-slides-visible') === 'auto'
        ? 'auto'
        : parseInt(list.getAttribute('yc-slider-slides-visible') || '1') || 1,

    // Enable/disable continuous loop mode
    loop: list.getAttribute('yc-slider-loop') === 'true' ? true : false || false,

    // Slide direction ('horizontal' or 'vertical')
    direction: directionParams,

    // Index of the initial slide
    initialSlide: parseInt(list.getAttribute('yc-slider-initial-slide') || '0') || 0,

    // CSS class of the wrapper element
    wrapperClass: listClass,

    // CSS class of the slide elements
    slideClass: itemClass,

    // Accessibility options
    a11y: {
      enabled: true,
      itemRoleDescriptionMessage: 'slider item',
    },

    // Navigation parameters
    navigation: navigationParams,

    // Number of additional slides to loop
    loopAdditionalSlides: parseInt(list.getAttribute('yc-slider-additional-slides') || '0') || 0,

    // Pagination parameters
    pagination: paginationParams,

    // Autoplay parameters
    autoplay: autoplayParams,

    // Breakpoint parameters for responsive design
    breakpoints: breakpointParams,

    // CSS class for the active slide
    slideActiveClass: list.getAttribute('yc-slider-active-class') || 'swiper-slide-active',

    // Center slides in the viewport
    centeredSlides: list.getAttribute('yc-slider-centered') === 'true' ? true : false || false,

    // Initialize the Swiper instance
    init: !list.getAttribute('yc-slider-disabled'),

    // Effect to use for slide transitions
    effect:
      window.innerWidth < 480 && effectsParams.effects === 'creative-flat'
        ? ''
        : effectsParams.effects,

    // Enable/disable grab cursor
    grabCursor:
      list.hasAttribute('yc-slider-grab-cursor') &&
        list.getAttribute('yc-slider-grab-cursor') === 'false'
        ? false
        : true,

    // Enable/disable touch move
    allowTouchMove:
      list.hasAttribute('yc-slider-swipe-to-change') &&
        list.getAttribute('yc-slider-swipe-to-change') === 'false'
        ? false
        : true,

    simulateTouch: list.getAttribute('yc-slider-touch') === 'false' ? false : true,

    // Set a null controller so users can remap it with the API if needed
    controller: {
      control: null,
    },
  };

  // Adding custom effect objects if specified
  if (effectsParams.fadeEffect) {
    swiperParams.fadeEffect = effectsParams.fadeEffect;

    const style = document.createElement('style');

    const fadeCss = `
        .${itemClass} {
          pointer-events: none;
        }

        .${itemClass}.swiper-slide-active {
          pointer-events: auto;
        }
      `;

    // Set the CSS text of the style element
    style.textContent = fadeCss;

    // Append the style element to the document head
    document.head.appendChild(style);
  }

  // Add cards effect if specified
  if (effectsParams.effects === 'cards') {
    swiperParams.cardsEffect = effectsParams.cardEffect;
  }

  // Add creative effect if specified
  if (effectsParams.effects === 'creative') {
    swiperParams.creativeEffect = effectsParams.creativeEffect;
  }

  return swiperParams;
}
