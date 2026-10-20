export function serializeText(rootElement) {
  try {
    const result = [...rootElement.childNodes]
      .map((child) => {
        if (child.classList?.contains('badge')) {
          return '';
        }
        if (child.classList?.contains('twemoji')) {
          return child.alt;
        }

        return child.textContent;
      })
      .join('')
      .replace(/\s+/g, ' ')
      .trim();

    return result;
  } catch (_) {
    return '';
  }
}
