/**
 * Logger System for SwiperFlow
 *
 * Provides structured logging with query parameter-based debug levels.
 * URL query param: ?swf-debug={full|minimal|off}
 *
 * Levels:
 * - full: All logs (log, warn, error)
 * - minimal: Errors only (default)
 * - off: No logging
 */

type LogLevel = 'full' | 'minimal' | 'off';

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = this.detectLogLevel();
  }

  /**
   * Detect logging level from URL query params
   * ?swf-debug=full - verbose logging
   * ?swf-debug=minimal - errors only
   * ?swf-debug=off - no logging
   * no param - minimal (default)
   */
  private detectLogLevel(): LogLevel {
    if (typeof window === 'undefined') return 'minimal';

    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get('swf-debug');

    if (debugParam === 'full') return 'full';
    if (debugParam === 'minimal') return 'minimal';
    if (debugParam === 'off') return 'off';

    return 'minimal'; // default to minimal
  }

  /**
   * Log informational message (only in full mode)
   */
  log(...args: any[]): void {
    if (this.level === 'full') {
      console.log('[SwiperFlow]', ...args);
    }
  }

  /**
   * Log warning message (only in full mode)
   */
  warn(...args: any[]): void {
    if (this.level === 'full') {
      console.warn('[SwiperFlow]', ...args);
    }
  }

  /**
   * Log error message (in full and minimal modes)
   */
  error(...args: any[]): void {
    if (this.level === 'full' || this.level === 'minimal') {
      console.error('[SwiperFlow Error]', ...args);
    }
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }
}

// Export singleton instance
export const logger = new Logger();
