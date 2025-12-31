/**
 * Generates the effects parameters for a Swiper instance based on the provided list element.
 *
 * @param list - The HTML element representing the list.
 * @returns An object containing the effects parameters.
 */
export function getEffectsParams(list: HTMLElement) {
  // Initialize the effects object with a default 'none' effect
  const effects: { effects: string;[key: string]: any } = {
    effects: 'none',
  };

  // Check if the 'yc-slider-effect' attribute is set to 'fade'
  if (list.getAttribute('yc-slider-effect') === 'fade') {
    effects.effects = 'fade';
    effects.fadeEffect = {
      crossFade: true,
    };
  }

  // Check if the 'yc-slider-effect' attribute is set to 'cards' or 'card'
  if (
    list.getAttribute('yc-slider-effect') === 'cards' ||
    list.getAttribute('yc-slider-effect') === 'card'
  ) {
    effects.effects = 'cards';
    effects.cardEffect = {
      perSlideOffset: 64,
      perSlideRotate: -2,
      slideShadows: true,
    };
  }

  // Check if the 'yc-slider-effect' attribute is set to 'creative'
  if (list.getAttribute('yc-slider-effect') === 'creative') {
    effects.effects = 'creative';
    effects.creativeEffect = {
      next: {
        translate: ['90%', '-2rem', 0],
        scale: 0.9,
      },
      prev: {
        translate: ['-90%', '-2rem', 0],
        scale: 0.9,
      },
    };
  }

  // Check if the 'yc-slider-effect' attribute is set to 'creative-flat'
  if (list.getAttribute('yc-slider-effect') === 'creative-flat') {
    effects.effects = 'creative';
    effects.creativeEffect = {
      next: {
        translate: ['90%', '-0rem', 0],
      },
      prev: {
        translate: ['-90%', '-0rem', 0],
      },
    };
  }

  // Return the constructed effects object
  return effects;
}
