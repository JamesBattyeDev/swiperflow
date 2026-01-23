import configParser from "./ConfigParser";
import { Swiper } from "swiper";

export class SwiperInstance {
  #swiper: Swiper | undefined
  component: HTMLElement
  config: any;

  constructor(element: HTMLElement) {
    this.component = element
    this.init()
  }


  init() {
    this.destroy()
    this.config = configParser.parse(this.component)
    this.#swiper = new Swiper(this.config.elements.wrapper, this.config)
  }

  destroy() {
    if (this.#swiper) {
      this.#swiper.destroy()
    }
  }

  get getSwiperInstance() {
    return this.#swiper
  }
}