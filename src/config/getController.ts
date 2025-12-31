import { logger } from '../helpers/logger';

export function getController(list: HTMLElement) {
  // Check if the list element has the 'swf-ctrl-pair' attribute
  const pairValue = list.dataset.swfCtrlPair;

  if (!pairValue) {
    return null; // Return null if the attribute doesn't exist
  }

  // Search the page for all elements with 'swf-ctrl-pair' attribute
  const allPairElements = document.querySelectorAll('[swf-ctrl-pair]');

  // Find the matching element (excluding the input element)
  for (const element of allPairElements) {
    const htmlElement = element as HTMLElement;
    if (element !== list && htmlElement.dataset.swfCtrlPair === pairValue) {
      const ctrlId = htmlElement.dataset.swfCtrlId;
      element.classList.add(`controller-side-one-${ctrlId}`);
      logger.log(`Controller class: .controller-side-one-${ctrlId}`);
      return `.controller-side-one-${ctrlId}`;
    }
  }

  return null; // Return null if no matching element is found
}
