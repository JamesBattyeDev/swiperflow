import { SwiperManager } from './modules/SwiperManager'
import { debounce } from './helpers/debounce'
import eventBus from './modules/EventBus'
import breakpointManager from './modules/BreakpointManager'
import type { Breakpoint } from './modules/BreakpointManager'
import type { SwiperInstance } from './modules/SwiperInstance'

export interface SwiperFlowAPI {
  sliders: SwiperInstance[]
  breakpoint: Breakpoint
  find: (query: string) => SwiperInstance | undefined
  init: () => void
  on: (event: string, callback: (detail?: any) => void) => void
}

let manager: SwiperManager

document.addEventListener('DOMContentLoaded', () => {
  manager = new SwiperManager();

  (window as any).swiperflow = {
    get sliders() { return manager.instances },
    get breakpoint() { return breakpointManager.current },
    find(query: string) { return manager.find(query) },
    init: () => manager.init(),
    on: (event: string, callback: (detail?: any) => void) => eventBus.on(event, callback),
  } satisfies SwiperFlowAPI

  window.addEventListener('resize', debounce(() => {
    manager.init()
  }, 300))
})
