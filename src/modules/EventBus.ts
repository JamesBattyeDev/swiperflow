type EventCallback = (detail?: any) => void;

interface EventMap {
  [eventName: string]: EventCallback[];
}

class SWFEventBus {
  #listeners: EventMap = {};

  on(event: string, callback: EventCallback) {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }
    this.#listeners[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.#listeners[event]) return;
    this.#listeners[event] = this.#listeners[event].filter((cb) => cb !== callback);
  }

  fire(event: string, detail?: any) {
    // Fire internal listeners
    if (this.#listeners[event]) {
      this.#listeners[event].forEach((cb) => cb(detail));
    }

    // Also dispatch as a CustomEvent on window for external listeners
    window.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

const eventBus = new SWFEventBus();
export default eventBus;
