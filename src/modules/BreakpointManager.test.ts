import { describe, expect, it, vi } from 'vitest';
import breakpointManager from './BreakpointManager';

function withWidth(w: number, fn: () => void) {
  Object.defineProperty(window, 'innerWidth', { value: w, configurable: true });
  fn();
}

// ── detect ──────────────────────────────────────────────────────

describe('detect', () => {
  it.each([
    [1200, 'desktop'],
    [992, 'desktop'],
    [991, 'tablet'],
    [768, 'tablet'],
    [767, 'mobileLandscape'],
    [480, 'mobileLandscape'],
    [479, 'mobilePortrait'],
    [320, 'mobilePortrait'],
  ] as const)('width %i returns %s', (width, expected) => {
    withWidth(width, () => {
      expect(breakpointManager.detect()).toBe(expected);
    });
  });
});

// ── update ──────────────────────────────────────────────────────

describe('update', () => {
  it('returns false when breakpoint has not changed', () => {
    withWidth(1200, () => breakpointManager.update());
    withWidth(1400, () => {
      expect(breakpointManager.update()).toBe(false);
    });
  });

  it('returns true when breakpoint changes', () => {
    withWidth(1200, () => breakpointManager.update());
    withWidth(400, () => {
      expect(breakpointManager.update()).toBe(true);
    });
  });

  it('updates current after a change', () => {
    withWidth(1200, () => breakpointManager.update());
    expect(breakpointManager.current).toBe('desktop');

    withWidth(400, () => breakpointManager.update());
    expect(breakpointManager.current).toBe('mobilePortrait');
  });

  it('fires swfBreakpointChange event on window when breakpoint changes', () => {
    withWidth(1200, () => breakpointManager.update());

    const listener = vi.fn();
    window.addEventListener('swfBreakpointChange', listener);

    withWidth(400, () => breakpointManager.update());

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.detail.previous).toBe('desktop');
    expect(event.detail.current).toBe('mobilePortrait');

    window.removeEventListener('swfBreakpointChange', listener);
  });
});

// ── is ──────────────────────────────────────────────────────────

describe('is', () => {
  it('returns true when breakpoint matches current', () => {
    withWidth(1200, () => breakpointManager.update());
    expect(breakpointManager.is('desktop')).toBe(true);
  });

  it('returns false when breakpoint does not match', () => {
    withWidth(1200, () => breakpointManager.update());
    expect(breakpointManager.is('mobilePortrait')).toBe(false);
  });
});

// ── matches ─────────────────────────────────────────────────────

describe('matches', () => {
  it('returns true when initValue is undefined', () => {
    expect(breakpointManager.matches(undefined)).toBe(true);
  });

  it('returns true when initValue is empty string', () => {
    expect(breakpointManager.matches('')).toBe(true);
  });

  it('returns true when current breakpoint is in the string', () => {
    withWidth(1200, () => breakpointManager.update());
    expect(breakpointManager.matches('desktop,tablet')).toBe(true);
  });

  it('returns false when current breakpoint is not in the string', () => {
    withWidth(1200, () => breakpointManager.update());
    expect(breakpointManager.matches('tablet,mobilePortrait')).toBe(false);
  });
});
