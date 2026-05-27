import config from 'src/config/config';
import type { Swiper } from 'swiper';

interface SwiperElement extends HTMLElement {
  swiper?: Swiper;
}

class ControllerRegistry {
  #connections: Map<Swiper, Swiper> = new Map();

  getConnections() {
    const allThumbs = Array.from(
      document.querySelectorAll(`[${config.keyWithPrefix('thumb-id')}]`)
    ) as HTMLElement[];
    allThumbs.forEach((thumb, thumbIndex) => {
      allThumbs.forEach((comparisonThumb, compIndex) => {
        if (thumb === comparisonThumb) return;
        if (!thumb.parentNode || !comparisonThumb.parentNode) return;
        if (thumb.dataset.swfThumbId === comparisonThumb.dataset.swfThumbId) {
          allThumbs.splice(compIndex, 1);
          this.#connections.set(
            (thumb.parentNode as SwiperElement).swiper!,
            (comparisonThumb.parentNode as SwiperElement).swiper!
          );
        }
      });

      allThumbs.splice(thumbIndex, 1);
    });
  }

  linkConnections() {
    this.getConnections();
    this.#connections.forEach((thumbsSwiper, mainSwiper) => {
      mainSwiper.controller.control = thumbsSwiper;
      mainSwiper.update();
      thumbsSwiper.controller.control = mainSwiper;
      thumbsSwiper.update();
    });
  }
}

const CtrlRegistry = new ControllerRegistry();
export default CtrlRegistry;
