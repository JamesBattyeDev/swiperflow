import { describe, expect, it, vi } from 'vitest';

function setWidth(w: number) {
  Object.defineProperty(window, 'innerWidth', { value: w, writable: true, configurable: true });
}

async function loadFresh(initialWidth: number) {
  vi.resetModules();
  setWidth(initialWidth);
  return (await import('./BreakpointManager')).default;
}

// ── detect ──────────────────────────────────────────────────────

describe('detect', () => {
  it('returns desktop for width >= 992', async () => {
    const bm = await loadFresh(1024);
    expect(bm.detect()).toBe('desktop');
  });

  it('returns desktop at boundary (992)', async () => {
    const bm = await loadFresh(992);
    expect(bm.detect()).toBe('desktop');
  });

  it('returns tablet at boundary (991)', async () => {
    const bm = await loadFresh(991);
    expect(bm.detect()).toBe('tablet');
  });

  it('returns tablet for width >= 569', async () => {
    const bm = await loadFresh(700);
    expect(bm.detect()).toBe('tablet');
  });

  it('returns mobile at boundary (568)', async () => {
    const bm = await loadFresh(568);
    expect(bm.detect()).toBe('mobile');
  });

  it('returns mobile for small widths', async () => {
    const bm = await loadFresh(320);
    expect(bm.detect()).toBe('mobile');
  });
});

// ── current ─────────────────────────────────────────────────────

describe('current', () => {
  it('reflects the breakpoint at construction time', async () => {
    const bm = await loadFresh(1200);
    expect(bm.current).toBe('desktop');
  });
});

// ── update ──────────────────────────────────────────────────────

describe('update', () => {
  it('returns false when breakpoint has not changed', async () => {
    const bm = await loadFresh(1200);
    // still desktop
    setWidth(1400);
    expect(bm.update()).toBe(false);
  });

  it('returns true when breakpoint has changed', async () => {
    const bm = await loadFresh(1200);
    setWidth(500);
    expect(bm.update()).toBe(true);
  });

  it('updates current after a change', async () => {
    const bm = await loadFresh(1200);
    expect(bm.current).toBe('desktop');

    setWidth(500);
    bm.update();
    expect(bm.current).toBe('mobile');
  });

  it('fires swfBreakpointChange event on window when breakpoint changes', async () => {
    const bm = await loadFresh(1200);
    const listener = vi.fn();
    window.addEventListener('swfBreakpointChange', listener);

    setWidth(500);
    bm.update();

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({
      previous: 'desktop',
      current: 'mobile',
      width: 500,
    });

    window.removeEventListener('swfBreakpointChange', listener);
  });
});

// ── is ──────────────────────────────────────────────────────────

describe('is', () => {
  it('returns true when breakpoint matches', async () => {
    const bm = await loadFresh(1200);
    expect(bm.is('desktop')).toBe(true);
  });

  it('returns false when breakpoint does not match', async () => {
    const bm = await loadFresh(1200);
    expect(bm.is('mobile')).toBe(false);
  });
});

// ── matches ─────────────────────────────────────────────────────

describe('matches', () => {
  it('returns true when initValue is undefined', async () => {
    const bm = await loadFresh(1200);
    expect(bm.matches(undefined)).toBe(true);
  });

  it('returns true when initValue is empty string', async () => {
    const bm = await loadFresh(1200);
    expect(bm.matches('')).toBe(true);
  });

  it('returns true when current breakpoint is in the string', async () => {
    const bm = await loadFresh(1200);
    expect(bm.matches('desktop,tablet')).toBe(true);
  });

  it('returns false when current breakpoint is not in the string', async () => {
    const bm = await loadFresh(1200);
    expect(bm.matches('tablet,mobile')).toBe(false);
  });
});
