import { afterEach, describe, expect, it } from 'vitest';

import configParser from './ConfigParser';

/** Helper: create an element with the given attributes */
function el(attrs: Record<string, string> = {}): HTMLElement {
  const div = document.createElement('div');
  for (const [k, v] of Object.entries(attrs)) {
    div.setAttribute(k, v);
  }
  return div;
}

/** Helper: set window.innerWidth for breakpoint tests */
function setWidth(w: number) {
  Object.defineProperty(window, 'innerWidth', { value: w, configurable: true });
}

afterEach(() => {
  // Reset to jsdom default
  Object.defineProperty(window, 'innerWidth', { value: 0, configurable: true });
});

// ── parseStringOrNumber ─────────────────────────────────────────

describe('parseStringOrNumber', () => {
  it('returns default when value is null', () => {
    expect(configParser.parseStringOrNumber(null, 5)).toBe(5);
  });

  it('returns default when value is empty string', () => {
    expect(configParser.parseStringOrNumber('', 10)).toBe(10);
  });

  it('returns "auto" for the string "auto"', () => {
    expect(configParser.parseStringOrNumber('auto', 1)).toBe('auto');
  });

  it('parses a valid integer string', () => {
    expect(configParser.parseStringOrNumber('42', 0)).toBe(42);
  });

  it('parses a valid float string', () => {
    expect(configParser.parseStringOrNumber('3.14', 0)).toBe(3.14);
  });

  it('returns default for non-numeric strings', () => {
    expect(configParser.parseStringOrNumber('abc', 7)).toBe(7);
  });
});

// ── parseDirection ──────────────────────────────────────────────

describe('parseDirection', () => {
  it('defaults to horizontal when no attribute', () => {
    expect(configParser.parseDirection(el())).toBe('horizontal');
  });

  it('returns horizontal', () => {
    expect(configParser.parseDirection(el({ 'data-swf-direction': 'horizontal' }))).toBe(
      'horizontal'
    );
  });

  it('returns vertical', () => {
    expect(configParser.parseDirection(el({ 'data-swf-direction': 'vertical' }))).toBe('vertical');
  });

  it('falls back to horizontal for invalid values', () => {
    expect(configParser.parseDirection(el({ 'data-swf-direction': 'diagonal' }))).toBe(
      'horizontal'
    );
  });
});

// ── parseEffects ────────────────────────────────────────────────

describe('parseEffects', () => {
  it('returns none when no effect attribute', () => {
    expect(configParser.parseEffects(el()).effects).toBe('none');
  });

  it('parses fade effect', () => {
    const result = configParser.parseEffects(el({ 'data-swf-effect': 'fade' }));
    expect(result.effects).toBe('fade');
    expect(result.fadeEffect).toEqual({ crossFade: true });
  });

  it('parses cards effect', () => {
    const result = configParser.parseEffects(el({ 'data-swf-effect': 'cards' }));
    expect(result.effects).toBe('cards');
    expect(result.cardEffect).toBeDefined();
    expect(result.cardEffect.perSlideOffset).toBe(64);
  });

  it('parses "card" as alias for cards', () => {
    const result = configParser.parseEffects(el({ 'data-swf-effect': 'card' }));
    expect(result.effects).toBe('cards');
  });

  it('parses creative effect', () => {
    const result = configParser.parseEffects(el({ 'data-swf-effect': 'creative' }));
    expect(result.effects).toBe('creative');
    expect(result.creativeEffect.next.scale).toBe(0.9);
    expect(result.creativeEffect.prev.scale).toBe(0.9);
  });

  it('parses creative-flat as creative effect with flat translate', () => {
    const result = configParser.parseEffects(el({ 'data-swf-effect': 'creative-flat' }));
    // creative-flat maps to the 'creative' Swiper effect type
    expect(result.effects).toBe('creative');
    expect(result.creativeEffect.next.translate).toEqual(['90%', '-0rem', 0]);
    // creative-flat should not have scale property
    expect(result.creativeEffect.next.scale).toBeUndefined();
  });

  it('returns none for unknown effect', () => {
    expect(configParser.parseEffects(el({ 'data-swf-effect': 'zoom' })).effects).toBe('none');
  });
});

// ── parseEasing ─────────────────────────────────────────────────

describe('parseEasing', () => {
  it('defaults to ease-out when no attribute', () => {
    const element = el();
    expect(configParser.parseEasing(element)).toBe('ease-out');
  });

  it.each(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'])(
    'accepts valid keyword "%s"',
    (keyword) => {
      expect(configParser.parseEasing(el({ 'data-swf-ease': keyword }))).toBe(keyword);
    }
  );

  it('accepts cubic-bezier values', () => {
    const value = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
    expect(configParser.parseEasing(el({ 'data-swf-ease': value }))).toBe(value);
  });

  it('normalises to lowercase', () => {
    expect(configParser.parseEasing(el({ 'data-swf-ease': 'EASE-IN' }))).toBe('ease-in');
  });

  it('returns default for invalid values', () => {
    expect(configParser.parseEasing(el({ 'data-swf-ease': 'bounce' }))).toBe('ease-out');
  });

  it('sets style.transition on the element', () => {
    const element = el({ 'data-swf-ease': 'linear' });
    configParser.parseEasing(element);
    expect(element.style.transition).toBe('linear');
  });
});

// ── parseAutoplay ───────────────────────────────────────────────

describe('parseAutoplay', () => {
  it('returns disabled when no attribute', () => {
    expect(configParser.parseAutoplay(el())).toEqual({ enabled: false });
  });

  it('returns enabled with default 3000ms delay', () => {
    expect(configParser.parseAutoplay(el({ 'data-swf-autoplay': '' }))).toEqual({
      enabled: true,
      delay: 3000,
    });
  });

  it('returns enabled with custom delay', () => {
    const element = el({ 'data-swf-autoplay': '', 'data-swf-autoplay-delay': '5000' });
    expect(configParser.parseAutoplay(element)).toEqual({ enabled: true, delay: 5000 });
  });
});

// ── parseKeyboard ───────────────────────────────────────────────

describe('parseKeyboard', () => {
  it('returns disabled when no attribute', () => {
    expect(configParser.parseKeyboard(el())).toEqual({ enabled: false });
  });

  it('returns enabled with defaults', () => {
    expect(configParser.parseKeyboard(el({ 'data-swf-keyboard': '' }))).toEqual({
      enabled: true,
      onlyInViewport: true,
      pageUpDown: true,
    });
  });

  it('respects onlyInViewport=false', () => {
    const element = el({ 'data-swf-keyboard': '', 'data-swf-keyboard-only-in-viewport': 'false' });
    expect(configParser.parseKeyboard(element).onlyInViewport).toBe(false);
  });

  it('respects pageUpDown=false', () => {
    const element = el({ 'data-swf-keyboard': '', 'data-swf-keyboard-page-up-down': 'false' });
    expect(configParser.parseKeyboard(element).pageUpDown).toBe(false);
  });
});

// ── parseBreakpoints ────────────────────────────────────────────

describe('parseBreakpoints', () => {
  it('returns empty object when no breakpoint attrs', () => {
    expect(configParser.parseBreakpoints(el())).toEqual({});
  });

  it('parses desktop breakpoint', () => {
    const element = document.createElement('div');
    element.dataset.swfBpDesktop = '3';
    expect(configParser.parseBreakpoints(element)).toEqual({ '992': { slidesPerView: 3 } });
  });

  it('parses all breakpoints', () => {
    const element = document.createElement('div');
    element.dataset.swfBpDesktop = '4';
    element.dataset.swfBpTablet = '2';
    element.dataset.swfBpMobileLandscape = '1';
    element.dataset.swfBpMobilePortrait = '1';
    const result = configParser.parseBreakpoints(element);
    expect(result).toEqual({
      '992': { slidesPerView: 4 },
      '768': { slidesPerView: 2 },
      '480': { slidesPerView: 1 },
      '0': { slidesPerView: 1 },
    });
  });

  it('parses per-breakpoint gap', () => {
    const element = document.createElement('div');
    element.dataset.swfBpDesktop = '3';
    element.dataset.swfGapDesktop = '24';
    element.dataset.swfBpTablet = '2';
    element.dataset.swfGapTablet = '16';
    expect(configParser.parseBreakpoints(element)).toEqual({
      '992': { slidesPerView: 3, spaceBetween: 24 },
      '768': { slidesPerView: 2, spaceBetween: 16 },
    });
  });

  it('gap-only breakpoint without slidesPerView', () => {
    const element = document.createElement('div');
    element.dataset.swfGapDesktop = '20';
    expect(configParser.parseBreakpoints(element)).toEqual({
      '992': { spaceBetween: 20 },
    });
  });

  it('supports "auto" for slidesPerView', () => {
    const element = document.createElement('div');
    element.dataset.swfBpDesktop = 'auto';
    expect(configParser.parseBreakpoints(element)).toEqual({
      '992': { slidesPerView: 'auto' },
    });
  });
});

// ── parseNavigation ─────────────────────────────────────────────

describe('parseNavigation', () => {
  it('returns disabled when no navigation element', () => {
    expect(configParser.parseNavigation(el())).toEqual({ enabled: false });
  });

  it('returns disabled when arrows are missing', () => {
    const component = el();
    const nav = el({ 'data-swf-element': 'navigation' });
    component.appendChild(nav);
    expect(configParser.parseNavigation(component)).toEqual({ enabled: false });
  });

  it('returns element refs when both arrows present', () => {
    const component = el();
    const nav = el({ 'data-swf-element': 'navigation' });
    const next = el({ 'data-swf-element': 'next-arrow' });
    const prev = el({ 'data-swf-element': 'prev-arrow' });
    nav.appendChild(next);
    nav.appendChild(prev);
    component.appendChild(nav);

    const result = configParser.parseNavigation(component);
    expect(result.nextEl).toBe(next);
    expect(result.prevEl).toBe(prev);
  });

  it('returns disabled when only one arrow is present', () => {
    const component = el();
    const nav = el({ 'data-swf-element': 'navigation' });
    nav.appendChild(el({ 'data-swf-element': 'next-arrow' }));
    component.appendChild(nav);
    expect(configParser.parseNavigation(component)).toEqual({ enabled: false });
  });
});

// ── parsePagination ─────────────────────────────────────────────

describe('parsePagination', () => {
  it('returns disabled when no pagination element', () => {
    expect(configParser.parsePagination(el())).toEqual({ enabled: false });
  });

  it('returns disabled when pagination dot is missing', () => {
    const component = el();
    component.appendChild(el({ 'data-swf-element': 'pagination' }));
    expect(configParser.parsePagination(component)).toEqual({ enabled: false });
  });

  it('returns full config when pagination and dot are present', () => {
    const component = el();
    const pagination = el({ 'data-swf-element': 'pagination' });
    const dot = document.createElement('button');
    dot.className = 'my-dot';
    dot.setAttribute('data-swf-element', 'pagination-dot');
    pagination.appendChild(dot);
    component.appendChild(pagination);

    const result = configParser.parsePagination(component);
    expect(result.el).toBe(pagination);
    expect(result.bulletActiveClass).toBe('is-active');
    expect(result.bulletClass).toBe('my-dot');
    expect(result.bulletElement).toBe('button');
    expect(result.clickable).toBe(true);
  });
});

// ── getActiveBreakpoint ─────────────────────────────────────────

describe('getActiveBreakpoint', () => {
  it('returns desktop for width >= 992', () => {
    setWidth(1200);
    expect(configParser.getActiveBreakpoint()).toBe('desktop');
  });

  it('returns desktop at boundary (992)', () => {
    setWidth(992);
    expect(configParser.getActiveBreakpoint()).toBe('desktop');
  });

  it('returns tablet at boundary (991)', () => {
    setWidth(991);
    expect(configParser.getActiveBreakpoint()).toBe('tablet');
  });

  it('returns tablet at boundary (768)', () => {
    setWidth(768);
    expect(configParser.getActiveBreakpoint()).toBe('tablet');
  });

  it('returns mobileLandscape at boundary (767)', () => {
    setWidth(767);
    expect(configParser.getActiveBreakpoint()).toBe('mobileLandscape');
  });

  it('returns mobileLandscape at boundary (480)', () => {
    setWidth(480);
    expect(configParser.getActiveBreakpoint()).toBe('mobileLandscape');
  });

  it('returns mobilePortrait at boundary (479)', () => {
    setWidth(479);
    expect(configParser.getActiveBreakpoint()).toBe('mobilePortrait');
  });

  it('returns mobilePortrait for small widths', () => {
    setWidth(320);
    expect(configParser.getActiveBreakpoint()).toBe('mobilePortrait');
  });
});

// ── shouldInitAtCurrentBreakpoint ───────────────────────────────

describe('shouldInitAtCurrentBreakpoint', () => {
  it('returns true when no init attribute (no restriction)', () => {
    setWidth(1200);
    expect(configParser.shouldInitAtCurrentBreakpoint(el())).toBe(true);
  });

  it('returns true when current breakpoint matches', () => {
    setWidth(1200);
    expect(configParser.shouldInitAtCurrentBreakpoint(el({ 'data-swf-init': 'desktop' }))).toBe(
      true
    );
  });

  it('returns false when current breakpoint does not match', () => {
    setWidth(400);
    expect(configParser.shouldInitAtCurrentBreakpoint(el({ 'data-swf-init': 'desktop' }))).toBe(
      false
    );
  });

  it('supports multiple breakpoints in init value', () => {
    setWidth(1200);
    expect(
      configParser.shouldInitAtCurrentBreakpoint(el({ 'data-swf-init': 'desktop,mobilePortrait' }))
    ).toBe(true);
  });
});
