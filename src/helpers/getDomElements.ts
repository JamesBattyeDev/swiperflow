export function domElements(element: HTMLDivElement) {
  const domElements = {
    wrapper: element.querySelector<HTMLElement>(`[yc-slider-element='wrapper']`),
    list: element.querySelector<HTMLElement>(`[yc-slider-element='list']`),
    item: element.querySelectorAll<HTMLElement>(`[yc-slider-element='item']`),
  };

  // Error Handling
  if (!domElements.wrapper) {
    return console.error(
      'Error: The wrapper element could not be found. Please ensure that an element with [yc-slider-element="wrapper"] exists.'
    );
  }
  if (!domElements.list) {
    return console.error(
      'Error: The list element could not be found. Please ensure that an element with [yc-slider-element="list"] exists.'
    );
  }
  if (!domElements.item) {
    return console.error(
      'Error: The item element could not be found. Please ensure that an element with [yc-slider-element="item"] exists.'
    );
  }
}
