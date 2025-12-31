import { Swiper } from 'swiper';
import { initializeSwiperObserver } from './config/filterConfig';
import { getSwiperConfig } from './config/swiperConfig';
import { getFirstWord } from '$utils/getClassName';

// Extend the Window interface to include ycAttributes
declare global {
  interface Window {
    ycAttributes?: {
      sliders?: { [key: string]: { swiper: Swiper; control: boolean } };
      initFunction: any
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

export function initSliders() {
  destroySliders();

  const sliders = document.querySelectorAll<HTMLElement>(`[yc-slider-component]`);
  // console.log(sliders);
  sliders.forEach((e, index) => {
    const wrapper = e.querySelector<HTMLElement>(`[yc-slider-element='wrapper']`);
    const list = e.querySelector<HTMLElement>(`[yc-slider-element='list']`);
    const item = e.querySelectorAll<HTMLElement>(`[yc-slider-element='item']`);

    if (!wrapper || !list || !item) return;

    if (item.length < 1 && !list.getAttribute('yc-slider-disabled')) return;

    const controller = list.getAttribute('yc-controller-role') === 'controller';

    const swiperParams = getSwiperConfig(e, wrapper, list, item, controller);

    interface SwiperWithRefresh extends Swiper {
      refreshClassName?: () => void;
    }
    let swiperInstance: SwiperWithRefresh;
    if (!list.getAttribute('yc-slider-init')) {
      swiperInstance = new Swiper(wrapper, swiperParams);
    };

    const width = window.innerWidth;
    const attributeValue = list.getAttribute('yc-slider-init');
    // console.log(attributeValue);
    if (attributeValue?.includes('desktop') && width > 992) {
      swiperInstance = new Swiper(wrapper, swiperParams);
    } else if (attributeValue?.includes('tablet') && width > 568 && width <= 991) {
      swiperInstance = new Swiper(wrapper, swiperParams);
    } else if (attributeValue?.includes('mobile') && width >= 320 && width <= 568) {
      swiperInstance = new Swiper(wrapper, swiperParams);
    }

    // console.log(swiperInstance);

    if (swiperInstance) {
      swiperInstance.refreshClassName = function () {
        let list = document.querySelector(`.${swiperInstance.params.wrapperClass}`);
        let item = list?.firstChild as HTMLElement;
        swiperInstance.params.slideClass = getFirstWord(item);
        swiperInstance.update();
      };
      sliderInstances[`${e.getAttribute('yc-slider-component')}-${index}`] = {
        swiper: swiperInstance,
        control: controller,
      };
    }

    if (list.getAttribute('yc-slider-filter')) {
      if (swiperInstance) {
        initializeSwiperObserver(swiperInstance, list);
      }
    }
  });

  window.dispatchEvent(new CustomEvent('ycSlidersLoaded', {
    detail: { sliders: sliderInstances },
  }));


  window.ycAttributes = window.ycAttributes || {};
  window.ycAttributes.sliders = sliderInstances;
  window.ycAttributes.initFunction = initSliders

  if (window.ycAttributes && window.ycAttributes.sliders) {
    const sliderKeys = Object.keys(window.ycAttributes.sliders);
    const { length } = sliderKeys;
    for (let i = 0; i < length; i++) {
      const key = sliderKeys[i];
      const slider = window.ycAttributes.sliders[key];
      if (slider.control) {
        const allPairElements = document.querySelectorAll('[yc-controller-pair]');
        const controls = [];
        for (const element of allPairElements) {
          if (
            element !== slider.swiper.slidesEl &&
            element.getAttribute('yc-controller-pair') ===
            slider.swiper.slidesEl.getAttribute('yc-controller-pair')
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

// Debounce utility
function debounce(fn: () => void, delay: number) {
  let timer: number;
  return () => {
    clearTimeout(timer);
    timer = window.setTimeout(fn, delay);
  };
}

// Initial call
initSliders();

// Debounced resize event
window.addEventListener('resize', debounce(() => {
  initSliders();
}, 300));
