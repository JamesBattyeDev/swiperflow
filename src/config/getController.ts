export function getController(list: HTMLElement) {
  // Check if the list element has the 'yc-controller-pair' attribute
  const pairValue = list.getAttribute('yc-controller-pair');

  if (!pairValue) {
    return null; // Return null if the attribute doesn't exist
  }

  // Search the page for all elements with 'yc-controller-pair' attribute
  const allPairElements = document.querySelectorAll('[yc-controller-pair]');

  // Find the matching element (excluding the input element)
  for (const element of allPairElements) {
    if (element !== list && element.getAttribute('yc-controller-pair') === pairValue) {
      element.classList.add(`controller-side-one-${element.getAttribute('yc-controller-id')}`);
      console.log(`.controller-side-one-${element.getAttribute('yc-controller-id')}`);
      return `.controller-side-one-${element.getAttribute('yc-controller-id')}`;
    }
  }

  return null; // Return null if no matching element is found
}
