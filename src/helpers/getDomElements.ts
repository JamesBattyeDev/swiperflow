import { logger } from './logger';

export function domElements(element: HTMLDivElement) {
  const domElements = {
    wrapper:
      element.querySelector<HTMLElement>(`[data-swf-element='wrapper']`) ||
      element.querySelector<HTMLElement>(`[data-swf-element='wrap']`) ||
      element.querySelector<HTMLElement>(`[data-swf-element='container']`),
    list: element.querySelector<HTMLElement>(`[data-swf-element='list']`),
    item: element.querySelectorAll<HTMLElement>(`[data-swf-element='item']`),
  };

  // Error Handling
  if (!domElements.wrapper) {
    return logger.error(
      'Error: The wrapper element could not be found. Please ensure that an element with [data-swf-element="wrapper"], [data-swf-element="wrap"], or [data-swf-element="container"] exists.'
    );
  }
  if (!domElements.list) {
    return logger.error(
      'Error: The list element could not be found. Please ensure that an element with [data-swf-element="list"] exists.'
    );
  }
  if (!domElements.item) {
    return logger.error(
      'Error: The item element could not be found. Please ensure that an element with [data-swf-element="item"] exists.'
    );
  }
}
