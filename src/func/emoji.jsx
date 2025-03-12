export function serializeText(rootElement) {
  const result = [...rootElement.childNodes]
    .map((child) => {
      if (child.classList?.contains('badge')) {
        return '';
      }
      if (child.classList?.contains('twemoji')) {
        return child.alt;
      }

      return child.textContent.trim();
    })
    .join('');

  return result;
}
