import { describe, expect, it } from 'vitest';

import config from './config';

describe('config', () => {
  it('keyWithPrefix returns data-swf- prefixed key', () => {
    expect(config.keyWithPrefix('loop')).toBe('data-swf-loop');
    expect(config.keyWithPrefix('effect')).toBe('data-swf-effect');
  });

  it('prefix is data-swf-', () => {
    expect(config.prefix).toBe('data-swf-');
  });
});
