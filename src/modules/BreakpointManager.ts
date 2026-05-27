import eventBus from './EventBus';

export type Breakpoint = 'desktop' | 'tablet' | 'mobileLandscape' | 'mobilePortrait';

export interface BreakpointConfig {
  desktop: number;
  tablet: number;
  mobileLandscape: number;
  mobilePortrait: number;
}

class BreakpointManager {
  #current: Breakpoint;
  #breakpoints: BreakpointConfig = {
    desktop: 992,
    tablet: 768,
    mobileLandscape: 480,
    mobilePortrait: 0,
  };

  constructor() {
    this.#current = this.detect();
  }

  detect(): Breakpoint {
    const width = window.innerWidth;
    if (width >= this.#breakpoints.desktop) return 'desktop';
    if (width >= this.#breakpoints.tablet) return 'tablet';
    if (width >= this.#breakpoints.mobileLandscape) return 'mobileLandscape';
    return 'mobilePortrait';
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
