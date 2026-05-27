import config from 'src/config/config';
import {
  A11y,
  Autoplay,
  Controller,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  EffectCube,
  EffectFade,
  Keyboard,
  Navigation,
  Pagination,
  Thumbs,
} from 'swiper/modules';

export type Breakpoint = 'desktop' | 'tablet' | 'mobileLandscape' | 'mobilePortrait';

class ConfigParser {
  /**
   * Get the currently active breakpoint based on window width
   */
  getActiveBreakpoint(): Breakpoint {
    const width = window.innerWidth;
    if (width >= 992) return 'desktop';
    if (width >= 768) return 'tablet';
    if (width >= 480) return 'mobileLandscape';
    return 'mobilePortrait';
  }

  /**
   * Parse the data-swf-init attribute to determine which breakpoints should initialize the slider
   * Returns an array of breakpoints where the slider should be active
   * If no attribute is set, returns null (meaning always initialize)
   */
  parseInitBreakpoints(list: HTMLElement): Breakpoint[] | null {
    const initValue = list.getAttribute(config.keyWithPrefix('init'));

    if (!initValue) return null; // No restriction, always init

    const breakpoints: Breakpoint[] = [];

    if (initValue.includes('desktop')) breakpoints.push('desktop');
    if (initValue.includes('tablet')) breakpoints.push('tablet');
    if (initValue.includes('mobileLandscape')) breakpoints.push('mobileLandscape');
    if (initValue.includes('mobilePortrait')) breakpoints.push('mobilePortrait');

    return breakpoints.length > 0 ? breakpoints : null;
  }

  /**
   * Check if the slider should be initialized at the current breakpoint
   */
  shouldInitAtCurrentBreakpoint(list: HTMLElement): boolean {
    const allowedBreakpoints = this.parseInitBreakpoints(list);

    // No restriction, always init
    if (allowedBreakpoints === null) return true;

    const currentBreakpoint = this.getActiveBreakpoint();
    return allowedBreakpoints.includes(currentBreakpoint);
  }

  getElements(component: HTMLElement) {
    const elements = {
      component,
      wrapper: component.querySelector(`[${config.keyWithPrefix('element')}="wrapper"]`),
      list: component.querySelector(`[${config.keyWithPrefix('element')}="list"]`),
      item: component.querySelector(`[${config.keyWithPrefix('element')}="item"]`),
      navigation: component.querySelector(`[${config.keyWithPrefix('element')}="navigation"]`),
      pagination: component.querySelector(`[${config.keyWithPrefix('element')}="pagination"]`),
    };

    return elements;
  }

  parse(component: HTMLElement) {
    const elements = this.getElements(component);
    const list = elements.list as HTMLElement;

    const navigationParams = this.parseNavigation(component);
    const paginationParams = this.parsePagination(component);
    const autoplayParams = this.parseAutoplay(list);
    const keyboardParams = this.parseKeyboard(list);
    const effectsParams = this.parseEffects(list);
    const breakpointParams = this.parseBreakpoints(list);
    const directionParams = this.parseDirection(list);

    this.parseEasing(list);

    const itemClass = elements.item?.className.split(' ')[0] || 'swiper-slide';
    const listClass = list.className.split(' ')[0] || 'swiper-wrapper';

    const swiperParams = {
      modules: [
        Navigation,
        Pagination,
        Autoplay,
        Keyboard,
        A11y,
        Thumbs,
        Controller,
        EffectFade,
        EffectCards,
        EffectCoverflow,
        EffectCreative,
        EffectCube,
      ],
      speed: parseInt(list.getAttribute(config.keyWithPrefix('speed')) || '') || 400,
      spaceBetween: parseInt(list.getAttribute(config.keyWithPrefix('gap')) || '') || 0,
      loop: list.hasAttribute(config.keyWithPrefix('loop')),
      direction: directionParams,
      initialSlide: parseInt(list.getAttribute(config.keyWithPrefix('initial')) || '') || 0,
      wrapperClass: listClass,
      slideClass: itemClass,
      a11y: {
        enabled: true,
        itemRoleDescriptionMessage: 'slider item',
      },
      navigation: navigationParams,
      loopAdditionalSlides:
        parseInt(list.getAttribute(config.keyWithPrefix('additional')) || '') || 0,
      pagination: paginationParams,
      autoplay: autoplayParams,
      keyboard: keyboardParams,
      breakpoints: breakpointParams,
      slideActiveClass:
        list.getAttribute(config.keyWithPrefix('active-class')) || 'swiper-slide-active',
      centeredSlides: list.hasAttribute(config.keyWithPrefix('centered')),
      init: list.dataset.swfDisabled === undefined,
      effect:
        window.innerWidth < 480 && effectsParams.effects === 'creative-flat'
          ? ''
          : effectsParams.effects,
      grabCursor: list.getAttribute(config.keyWithPrefix('grab')) !== 'false',
      allowTouchMove: list.getAttribute(config.keyWithPrefix('swipe')) !== 'false',
      simulateTouch: list.getAttribute(config.keyWithPrefix('touch')) !== 'false',
      fadeEffect: effectsParams.fadeEffect,
      cardsEffect: effectsParams.effects === 'cards' ? effectsParams.cardEffect : undefined,
      creativeEffect:
        effectsParams.effects === 'creative' ? effectsParams.creativeEffect : undefined,
      elements,
    };

    return swiperParams;
  }

  parseStringOrNumber(value: string | null, defaultValue: number | string): number | string {
    if (!value) return defaultValue;
    if (value === 'auto') return 'auto';
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }

  parseNavigation(component: HTMLElement) {
    const nav = component.querySelector<HTMLElement>(
      `[${config.keyWithPrefix('element')}="navigation"]`
    );

    if (!nav) {
      return { enabled: false };
    }

    const nextArrow = nav.querySelector<HTMLElement>(
      `[${config.keyWithPrefix('element')}="next-arrow"]`
    );
    const prevArrow = nav.querySelector<HTMLElement>(
      `[${config.keyWithPrefix('element')}="prev-arrow"]`
    );

    if (!nextArrow || !prevArrow) {
      return { enabled: false };
    }

    return {
      nextEl: nextArrow,
      prevEl: prevArrow,
    };
  }

  parsePagination(component: HTMLElement) {
    const paginationElement = component.querySelector<HTMLElement>(
      `[${config.keyWithPrefix('element')}="pagination"]`
    );

    if (!paginationElement) {
      return { enabled: false };
    }

    const paginationDot = paginationElement.querySelector<HTMLElement>(
      `[${config.keyWithPrefix('element')}="pagination-dot"]`
    );

    if (!paginationDot) {
      return { enabled: false };
    }

    const paginationDotClass = paginationDot.className.split(' ')[0] || 'swiper-pagination-bullet';

    return {
      el: paginationElement,
      bulletActiveClass: 'is-active',
      bulletClass: paginationDotClass,
      bulletElement: 'button',
      clickable: true,
    };
  }

  parseDirection(list: HTMLElement): 'horizontal' | 'vertical' {
    const directionAttr =
      (list.getAttribute(config.keyWithPrefix('direction')) as 'horizontal' | 'vertical') ||
      'horizontal';

    return ['horizontal', 'vertical'].includes(directionAttr) ? directionAttr : 'horizontal';
  }

  parseBreakpoints(list: HTMLElement) {
    const breakpointParams: any = {};

    const tiers = [
      { key: '992', view: list.dataset.swfBpDesktop, gap: list.dataset.swfGapDesktop },
      { key: '768', view: list.dataset.swfBpTablet, gap: list.dataset.swfGapTablet },
      {
        key: '480',
        view: list.dataset.swfBpMobileLandscape,
        gap: list.dataset.swfGapMobileLandscape,
      },
      { key: '0', view: list.dataset.swfBpMobilePortrait, gap: list.dataset.swfGapMobilePortrait },
    ];

    for (const { key, view, gap } of tiers) {
      if (!view && !gap) continue;
      const bp: any = {};
      if (view) bp.slidesPerView = this.parseStringOrNumber(view, 1);
      if (gap) bp.spaceBetween = parseInt(gap) || 0;
      breakpointParams[key] = bp;
    }

    return breakpointParams;
  }

  parseAutoplay(list: HTMLElement) {
    const enabled = list.hasAttribute(config.keyWithPrefix('autoplay'));

    if (enabled) {
      return {
        enabled: true,
        delay:
          parseInt(list.getAttribute(config.keyWithPrefix('autoplay-delay')) as string) || 3000,
      };
    }

    return {
      enabled: false,
    };
  }

  parseKeyboard(list: HTMLElement) {
    const enabled = list.hasAttribute(config.keyWithPrefix('keyboard'));

    if (enabled) {
      return {
        enabled: true,
        onlyInViewport:
          list.getAttribute(config.keyWithPrefix('keyboard-only-in-viewport')) !== 'false',
        pageUpDown: list.getAttribute(config.keyWithPrefix('keyboard-page-up-down')) !== 'false',
      };
    }

    return {
      enabled: false,
    };
  }

  parseEffects(list: HTMLElement) {
    const effectAttr = list.getAttribute(config.keyWithPrefix('effect')) || '';

    const effects: { effects: string; [key: string]: any } = {
      effects: 'none',
    };

    if (effectAttr === 'fade') {
      effects.effects = 'fade';
      effects.fadeEffect = {
        crossFade: true,
      };
    }

    if (effectAttr === 'cards' || effectAttr === 'card') {
      effects.effects = 'cards';
      effects.cardEffect = {
        perSlideOffset: 64,
        perSlideRotate: -2,
        slideShadows: true,
      };
    }

    if (effectAttr === 'creative') {
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

    if (effectAttr === 'creative-flat') {
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

    return effects;
  }

  parseEasing(list: HTMLElement) {
    const VALID_EASING_KEYWORDS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];
    const DEFAULT_EASE = 'ease-out';

    const easingValue = list.getAttribute(config.keyWithPrefix('ease')) || DEFAULT_EASE;
    const normalizedValue = easingValue.toLowerCase();

    const isValidKeyword = VALID_EASING_KEYWORDS.includes(normalizedValue);
    const isCubicBezier = normalizedValue.startsWith('cubic-bezier(');

    let finalValue = DEFAULT_EASE;

    if (isValidKeyword || isCubicBezier) {
      finalValue = normalizedValue;
    }

    list.style.setProperty('transition', finalValue);

    return finalValue;
  }
}

const configParser = new ConfigParser();
export default configParser;
