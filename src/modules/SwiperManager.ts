import config from 'src/config/config';

import breakpointManager from './BreakpointManager';
import CtrlRegistry from './ControllerRegistry';
import eventBus from './EventBus';
import { SwiperInstance } from './SwiperInstance';

export class SwiperManager {
  instances: SwiperInstance[] = [];

  constructor() {
    this.init();
  }

  init() {
    const isReinitialize = this.instances.length > 0;

    this.destroyAll();

    const allSliders = document.querySelectorAll(`[${config.keyWithPrefix('component')}]`);
    allSliders.forEach((element) => {
      const swiper = this.initSlider(element as HTMLElement);
      if (swiper) {
        this.instances.push(swiper);
      }
    });

    CtrlRegistry.linkConnections();

    eventBus.fire('swfLoaded', {
      sliders: this.instances,
      timestamp: Date.now(),
    });

    if (isReinitialize) {
      breakpointManager.update();
      eventBus.fire('swfResize', {
        sliders: this.instances,
        timestamp: Date.now(),
        activeBreakpoint: breakpointManager.current,
      });
    }
  }

  initSlider(sliderComponent: HTMLElement): SwiperInstance | null {
    const list = sliderComponent.querySelector<HTMLElement>(
      `[${config.keyWithPrefix('element')}='list']`
    );
    const initValue = list?.dataset.swfInit;

    if (!breakpointManager.matches(initValue)) {
      return null;
    }

    const swiper = new SwiperInstance(sliderComponent);
    return swiper;
  }

  destroyAll() {
    this.instances.forEach((instance) => instance.destroy());
    this.instances = [];
  }

  find(query: string) {
    return this.instances.find((instance) => instance.component.dataset.swfComponent === query);
  }
}
