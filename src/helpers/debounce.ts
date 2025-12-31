/**
 * Debounce utility to limit function execution rate
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * const debouncedResize = debounce(() => {
 *   console.log('Resized!');
 * }, 300);
 * window.addEventListener('resize', debouncedResize);
 */
export function debounce(fn: () => void, delay: number): () => void {
  let timer: number;
  return () => {
    clearTimeout(timer);
    timer = window.setTimeout(fn, delay);
  };
}
