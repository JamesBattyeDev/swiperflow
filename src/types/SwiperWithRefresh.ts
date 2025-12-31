import Swiper from "swiper";

export interface SwiperWithRefresh extends Swiper {
  refreshClassName?: () => void;
}