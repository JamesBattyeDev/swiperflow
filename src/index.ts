import { Swiper } from 'swiper';
import { initializeSwiperObserver } from './config/filterConfig';
import { getSwiperConfig } from './config/swiperConfig';
import { getFirstWord } from '$utils/getClassName';
import { debounce } from './helpers/debounce';
import type { SwiperWithRefresh } from './types/SwiperWithRefresh';
import { logger } from '$utils/logger';

// Extend the Window interface to include swiperflow
declare global {
  interface Window {
    swiperflow?: {
      sliders?: { [key: string]: { swiper: Swiper; control: boolean } };
      init: () => void;
    };
  }
}

let sliderInstances: { [key: string]: { swiper: Swiper; control: boolean } } = {};

function destroySliders() {
  Object.values(sliderInstances).forEach(({ swiper }) => {
    if (swiper && typeof swiper.destroy === 'function') {
      swiper.destroy(true, true);
    }
  });
  sliderInstances = {};
}

// Helper function to detect active breakpoint
function getActiveBreakpoint(): 'desktop' | 'tablet' | 'mobile' {
  const width = window.innerWidth;
  if (width > 991) return 'desktop';
  if (width > 568) return 'tablet';
  return 'mobile';
}

export function initSliders() {
  const isReinitialize = Object.keys(sliderInstances).length > 0;

  destroySliders();

  const sliders = document.querySelectorAll<HTMLElement>(`[data-swf-component]`);
  logger.log(`\n\n***** Found ${sliders.length} slider(s) on the page *****\n`);

  sliders.forEach((e, index) => {
    logger.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    logger.log(`INITIALIZING SLIDER #${index + 1}`);
    logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    // Support multiple naming conventions for wrapper
    const wrapper =
      e.querySelector<HTMLElement>(`[data-swf-element='wrapper']`) ||
      e.querySelector<HTMLElement>(`[data-swf-element='wrap']`) ||
      e.querySelector<HTMLElement>(`[data-swf-element='container']`);

    const list = e.querySelector<HTMLElement>(`[data-swf-element='list']`);
    const item = e.querySelectorAll<HTMLElement>(`[data-swf-element='item']`);

    logger.log('Found elements:');
    logger.log('  wrapper:', wrapper ? '✓' : '✗');
    logger.log('  list:', list ? '✓' : '✗');
    logger.log('  items:', item?.length || 0);

    if (!wrapper || !list || !item) {
      logger.log('❌ Missing required elements, skipping this slider');
      return;
    }

    if (item.length < 1 && !list.dataset.swfDisabled) {
      logger.log('❌ No items found and not disabled, skipping this slider');
      return;
    }

    const controller = list.dataset.swfCtrlRole === 'controller';
    logger.log('Is controller:', controller);

    const swiperParams = getSwiperConfig(e, wrapper, list, item, controller);

    let swiperInstance: SwiperWithRefresh | null = null;

    const width = window.innerWidth;
    const initValue = list.dataset.swfInit;

    logger.log('\n--- Conditional Initialization Check ---');
    logger.log('Window width:', width);
    logger.log('swfInit value:', initValue || 'none (initialize always)');

    if (!list.dataset.swfInit) {
      logger.log('✓ No swfInit restriction, initializing Swiper');
      swiperInstance = new Swiper(wrapper, swiperParams);
    } else if (initValue?.includes('desktop') && width > 992) {
      logger.log('✓ Desktop init condition met, initializing Swiper');
      swiperInstance = new Swiper(wrapper, swiperParams);
    } else if (initValue?.includes('tablet') && width > 568 && width <= 991) {
      logger.log('✓ Tablet init condition met, initializing Swiper');
      swiperInstance = new Swiper(wrapper, swiperParams);
    } else if (initValue?.includes('mobile') && width >= 320 && width <= 568) {
      logger.log('✓ Mobile init condition met, initializing Swiper');
      swiperInstance = new Swiper(wrapper, swiperParams);
    } else {
      logger.log('✗ Init conditions not met, NOT initializing Swiper');
    }

    if (swiperInstance) {
      logger.log('✓ Swiper instance created successfully');
      swiperInstance.refreshClassName = function () {
        let list = document.querySelector(`.${swiperInstance.params.wrapperClass}`);
        let item = list?.firstChild as HTMLElement;
        swiperInstance.params.slideClass = getFirstWord(item);
        swiperInstance.update();
      };

      // Dispatch per-slider initialization event
      e.dispatchEvent(new CustomEvent('swfSliderInit', {
        detail: {
          swiper: swiperInstance,
          element: e,
        },
        bubbles: true,
      }));

      sliderInstances[`${e.dataset.swfComponent}-${index}`] = {
        swiper: swiperInstance,
        control: controller,
      };
    }
    if (list.dataset.swfFilter && swiperInstance) {
      initializeSwiperObserver(swiperInstance, list);
    }
  });

  // Dispatch global loaded event
  window.dispatchEvent(new CustomEvent('swfLoaded', {
    detail: {
      sliders: sliderInstances,
      timestamp: Date.now(),
    },
  }));

  // Dispatch resize event if this is a reinitialize
  if (isReinitialize) {
    window.dispatchEvent(new CustomEvent('swfResize', {
      detail: {
        sliders: sliderInstances,
        timestamp: Date.now(),
        activeBreakpoint: getActiveBreakpoint(),
      },
    }));
  }

  // Set global swiperflow object
  if (!window.swiperflow) {
    window.swiperflow = {
      sliders: sliderInstances,
      init: initSliders,
    };
  } else {
    window.swiperflow.sliders = sliderInstances;
    window.swiperflow.init = initSliders;
  }

  logger.log(sliderInstances)

  // controller logic
  if (window.swiperflow && window.swiperflow.sliders) {
    const sliderKeys = Object.keys(window.swiperflow.sliders);
    const { length } = sliderKeys;
    for (let i = 0; i < length; i++) {
      const key = sliderKeys[i];
      const slider = window.swiperflow.sliders[key];
      if (slider.control) {
        const allPairElements = document.querySelectorAll('[data-swf-ctrl-pair]');
        const controls = [];
        for (const element of allPairElements) {
          const htmlElement = element as HTMLElement;
          if (
            element !== slider.swiper.slidesEl &&
            htmlElement.dataset.swfCtrlPair ===
            (slider.swiper.slidesEl as HTMLElement).dataset.swfCtrlPair
          ) {
            const parent = element.parentNode as any;
            const parentSwiper = parent?.swiper;
            if (parentSwiper) {
              controls.push(parentSwiper);
            }
          }
        }
        slider.swiper.controller.control = controls;
      }
    }
  }
}

// Initial call
initSliders();

// Debounced resize event
window.addEventListener('resize', debounce(() => {
  initSliders();
}, 300));
