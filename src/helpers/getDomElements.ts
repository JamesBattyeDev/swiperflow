import { logger } from './logger';

export function domElements(element: HTMLDivElement) {
  const domElements = {
    wrapper: element.querySelector<HTMLElement>(`[swf-element='wrapper']`),
    list: element.querySelector<HTMLElement>(`[swf-element='list']`),
    item: element.querySelectorAll<HTMLElement>(`[swf-element='item']`),
  };

  // Error Handling
  if (!domElements.wrapper) {
    return logger.error(
      'Error: The wrapper element could not be found. Please ensure that an element with [swf-element="wrapper"] exists.'
    );
  }
  if (!domElements.list) {
    return logger.error(
      'Error: The list element could not be found. Please ensure that an element with [swf-element="list"] exists.'
    );
  }
  if (!domElements.item) {
    return logger.error(
      'Error: The item element could not be found. Please ensure that an element with [swf-element="item"] exists.'
    );
  }
}
