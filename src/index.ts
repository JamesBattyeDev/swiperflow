import { Swiper } from 'swiper';
import { initializeSwiperObserver } from './config/filterConfig';
import { getSwiperConfig } from './config/swiperConfig';
import { getFirstWord } from '$utils/getClassName';
import { debounce } from './helpers/debounce';
import type { SwiperWithRefresh } from './types/SwiperWithRefresh';

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

  const sliders = document.querySelectorAll<HTMLElement>(`[swf-component]`);
  sliders.forEach((e, index) => {
    const wrapper = e.querySelector<HTMLElement>(`[swf-element='wrapper']`);
    const list = e.querySelector<HTMLElement>(`[swf-element='list']`);
    const item = e.querySelectorAll<HTMLElement>(`[swf-element='item']`);

    if (!wrapper || !list || !item) return;

    if (item.length < 1 && !list.dataset.swfDisabled) return;

    const controller = list.dataset.swfCtrlRole === 'controller';

    const swiperParams = getSwiperConfig(e, wrapper, list, item, controller);

    let swiperInstance: SwiperWithRefresh | null = null;

    if (!list.dataset.swfInit) {
      swiperInstance = new Swiper(wrapper, swiperParams);
    };

    const width = window.innerWidth;
    const initValue = list.dataset.swfInit;
    if (initValue?.includes('desktop') && width > 992) {
      swiperInstance = new Swiper(wrapper, swiperParams);
    } else if (initValue?.includes('tablet') && width > 568 && width <= 991) {
      swiperInstance = new Swiper(wrapper, swiperParams);
    } else if (initValue?.includes('mobile') && width >= 320 && width <= 568) {
      swiperInstance = new Swiper(wrapper, swiperParams);
    }

    if (swiperInstance) {
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

  // controller logic
  if (window.swiperflow && window.swiperflow.sliders) {
    const sliderKeys = Object.keys(window.swiperflow.sliders);
    const { length } = sliderKeys;
    for (let i = 0; i < length; i++) {
      const key = sliderKeys[i];
      const slider = window.swiperflow.sliders[key];
      if (slider.control) {
        const allPairElements = document.querySelectorAll('[swf-ctrl-pair]');
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
