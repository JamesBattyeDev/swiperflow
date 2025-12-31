export function getFirstWord(element: HTMLElement): string {
  let str = element?.className || 'swiper-item';
  // Trim any leading or trailing spaces from the string
  str = str.trim();
  // Find the first space in the string
  const spaceIndex = str.indexOf(' ');
  if (spaceIndex === -1) {
    // If there are no spaces in the string, return the whole string
    return str;
  }
  // If there is a space in the string, return the substring before the space
  return str.substring(0, spaceIndex);
}
