import eventBus from './EventBus';

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export interface BreakpointConfig {
  desktop: number;
  tablet: number;
  mobile: number;
}

class BreakpointManager {
  #current: Breakpoint;
  #breakpoints: BreakpointConfig = {
    desktop: 992,
    tablet: 991,
    mobile: 0,
  };

  constructor() {
    this.#current = this.detect();
  }

  detect(): Breakpoint {
    const width = window.innerWidth;
    if (width >= this.#breakpoints.desktop) return 'desktop';
    if (width >= this.#breakpoints.tablet) return 'tablet';
    return 'mobile';
  }

  get current(): Breakpoint {
    return this.#current;
  }

  get width(): number {
    return window.innerWidth;
  }

  update(): boolean {
    const previous = this.#current;
    this.#current = this.detect();

    if (previous !== this.#current) {
      eventBus.fire('swfBreakpointChange', {
        previous,
        current: this.#current,
        width: this.width,
      });
      return true;
    }
    return false;
  }

  is(breakpoint: Breakpoint): boolean {
    return this.#current === breakpoint;
  }

  matches(initValue: string | undefined): boolean {
    if (!initValue) return true;
    return initValue.includes(this.#current);
  }
}

const breakpointManager = new BreakpointManager();
export default breakpointManager;
