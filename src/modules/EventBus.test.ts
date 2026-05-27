import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('SWFEventBus', () => {
  let eventBus: typeof import('./EventBus')['default'];

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('./EventBus');
    eventBus = mod.default;
  });

  it('listener receives detail when event fires', () => {
    const listener = vi.fn();
    eventBus.on('test', listener);
    eventBus.fire('test', { value: 42 });

    expect(listener).toHaveBeenCalledWith({ value: 42 });
  });

  it('multiple listeners on the same event all fire', () => {
    const a = vi.fn();
    const b = vi.fn();
    eventBus.on('evt', a);
    eventBus.on('evt', b);
    eventBus.fire('evt', 'payload');

    expect(a).toHaveBeenCalledWith('payload');
    expect(b).toHaveBeenCalledWith('payload');
  });

  it('listeners on different events are independent', () => {
    const a = vi.fn();
    const b = vi.fn();
    eventBus.on('one', a);
    eventBus.on('two', b);
    eventBus.fire('one');

    expect(a).toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
  });

  it('off removes a listener', () => {
    const listener = vi.fn();
    eventBus.on('evt', listener);
    eventBus.off('evt', listener);
    eventBus.fire('evt');

    expect(listener).not.toHaveBeenCalled();
  });

  it('off on a non-existent event is a no-op', () => {
    expect(() => eventBus.off('nope', vi.fn())).not.toThrow();
  });

  it('fire with no listeners does not throw', () => {
    expect(() => eventBus.fire('nobody-listening')).not.toThrow();
  });

  it('fire dispatches a CustomEvent on window', () => {
    const windowListener = vi.fn();
    window.addEventListener('swfTest', windowListener);

    eventBus.fire('swfTest', { data: 'hello' });

    expect(windowListener).toHaveBeenCalledOnce();
    const event = windowListener.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ data: 'hello' });

    window.removeEventListener('swfTest', windowListener);
  });
});
