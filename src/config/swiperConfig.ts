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
import {
  parseBooleanAttr,
  parseNumberAttr,
  parseStringAttr,
  parseStringOrNumberAttr,
} from '../helpers/attributeParser';
import { getAutoplayParams } from './autoplayConfig';
import { getBreakpointParams } from './breakpointConfig';
import { getDirection } from './directionConfig';
import { getEffectsParams } from './effectsConfig';
import { getNavigationParams } from './navigationConfig';
import { getPaginationParams } from './paginationConfig';
import { logger } from '../helpers/logger';

// Default configuration values
const DEFAULTS = {
  speed: 400,
  gap: 0,
  visible: 1,
  loop: false,
  initial: 0,
  additional: 0,
  centered: false,
  activeClass: 'swiper-slide-active',
  grab: true,
  swipe: true,
  touch: true,
} as const;

// Function to generate the configuration for a Swiper instance based on the provided element
/**
 * Generates the configuration for a Swiper instance based on the provided element.
 * @param {HTMLElement} element - The main element containing the Swiper.
 * @param {HTMLElement} wrapper - The wrapper element for the Swiper.
 * @param {HTMLElement} list - The list element containing the slides.
 * @param {NodeListOf<HTMLElement>} item - The individual slide elements.
 * @param {Boolean} controller - Does swiper have a controller?.
 * @returns {SwiperOptions} - The configuration object for Swiper.
 */
export function getSwiperConfig(
  element: HTMLElement,
  wrapper: HTMLElement,
  list: HTMLElement,
  item: NodeListOf<HTMLElement>,
  controller: boolean
): SwiperOptions {
  logger.log('==================== getSwiperConfig START ====================');
  logger.log('List element:', list);
  logger.log('List dataset (all attributes):', list.dataset);
  logger.log('List dataset keys:', Object.keys(list.dataset));

  // Retrieve attribute-based configurations
  logger.log('\n--- Parsing Navigation ---');
  const navigationParams = getNavigationParams(element);

  logger.log('\n--- Parsing Pagination ---');
  const paginationParams = getPaginationParams(element);

  logger.log('\n--- Parsing Autoplay ---');
  const autoplayParams = getAutoplayParams(list);

  logger.log('\n--- Parsing Effects ---');
  const effectsParams = getEffectsParams(list);

  logger.log('\n--- Parsing Breakpoints ---');
  const breakpointParams = getBreakpointParams(list);

  logger.log('\n--- Parsing Direction ---');
  const directionParams = getDirection(list);

  // Get list, wrapper and item classes
  const itemClass = getFirstWord(item[0]);
  const listClass = getFirstWord(list);

  logger.log('\n--- CSS Classes ---');
  logger.log('itemClass:', itemClass);
  logger.log('listClass:', listClass);

  // Duplicate slides if the attribute 'swf-double' is present
  if (list.dataset.swfDouble) {
    logger.log('\n--- Duplicating slides (swfDouble present) ---');
    item.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      list.appendChild(clone);
    });
  }

  logger.log('\n--- Parsing Core Attributes ---');
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
    speed: parseNumberAttr(list, 'speed', DEFAULTS.speed),

    // Space between slides in pixels
    spaceBetween: parseNumberAttr(list, 'gap', DEFAULTS.gap),

    // Number of slides visible at the same time
    slidesPerView: parseStringOrNumberAttr(list, 'visible', DEFAULTS.visible),

    // Enable/disable continuous loop mode
    loop: parseBooleanAttr(list, 'loop', DEFAULTS.loop),

    // Slide direction ('horizontal' or 'vertical')
    direction: directionParams,

    // Index of the initial slide
    initialSlide: parseNumberAttr(list, 'initial', DEFAULTS.initial),

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
    loopAdditionalSlides: parseNumberAttr(list, 'additional', DEFAULTS.additional),

    // Pagination parameters
    pagination: paginationParams,

    // Autoplay parameters
    autoplay: autoplayParams,

    // Breakpoint parameters for responsive design
    breakpoints: breakpointParams,

    // CSS class for the active slide
    slideActiveClass: parseStringAttr(list, 'activeClass', DEFAULTS.activeClass),

    // Center slides in the viewport
    centeredSlides: parseBooleanAttr(list, 'centered', DEFAULTS.centered),

    // Initialize the Swiper instance
    init: !list.dataset.swfDisabled,

    // Effect to use for slide transitions
    effect:
      window.innerWidth < 480 && effectsParams.effects === 'creative-flat'
        ? ''
        : effectsParams.effects,

    // Enable/disable grab cursor
    grabCursor: parseBooleanAttr(list, 'grab', DEFAULTS.grab),

    // Enable/disable touch move
    allowTouchMove: parseBooleanAttr(list, 'swipe', DEFAULTS.swipe),

    // Enable/disable touch simulation
    simulateTouch: parseBooleanAttr(list, 'touch', DEFAULTS.touch),

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

  // Log the complete configuration
  logger.log('\n==================== FINAL CONFIGURATION ====================');
  logger.log('Element:', element);
  logger.log('\nParsed Settings:');
  logger.log('  speed:', swiperParams.speed);
  logger.log('  spaceBetween:', swiperParams.spaceBetween, '← THIS IS THE GAP');
  logger.log('  slidesPerView:', swiperParams.slidesPerView);
  logger.log('  loop:', swiperParams.loop);
  logger.log('  direction:', swiperParams.direction);
  logger.log('  initialSlide:', swiperParams.initialSlide);
  logger.log('  loopAdditionalSlides:', swiperParams.loopAdditionalSlides);
  logger.log('  slideActiveClass:', swiperParams.slideActiveClass);
  logger.log('  centeredSlides:', swiperParams.centeredSlides);
  logger.log('  grabCursor:', swiperParams.grabCursor);
  logger.log('  allowTouchMove:', swiperParams.allowTouchMove);
  logger.log('  simulateTouch:', swiperParams.simulateTouch);
  logger.log('  effect:', swiperParams.effect);
  logger.log('  autoplay:', swiperParams.autoplay);
  logger.log('  breakpoints:', swiperParams.breakpoints);
  logger.log('  navigation:', navigationParams);
  logger.log('  pagination:', paginationParams);
  logger.log('\nRaw Dataset:', list.dataset);
  logger.log('==================== getSwiperConfig END ====================\n\n');

  return swiperParams;
}
