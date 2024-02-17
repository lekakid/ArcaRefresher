function getFilterFromData(infoElement) {
  return (
    infoElement.matches('[data-filter]')
      ? infoElement
      : infoElement.querySelector('[data-filter]')
  )?.dataset.filter;
}

function getFilterFromAnchor(infoElement) {
  const anchor = infoElement.matches('a')
    ? infoElement
    : infoElement.querySelector('a');
  if (!anchor) return undefined;

  return anchor.title || anchor.textContent.replace('@', '');
}

export function getUserNick(infoElement) {
  const filter =
    getFilterFromData(infoElement) || getFilterFromAnchor(infoElement);
  if (filter) {
    const [, nick, id] = filter
      .match(/(.*)(#[0-9]{8})$|(.*), ([0-9]{1,3}\.[0-9]{1,3})$|(.*)/)
      .filter((e) => e);

    // 반고닉
    if (id?.includes('#')) {
      return `${nick}${id}`;
    }

    // 유동
    if (id?.includes('.')) {
      return `${nick}(${id})`;
    }

    return nick;
  }

  return infoElement.textContent.trim() || '알 수 없음';
}

export function getUserID(infoElement) {
  const filter =
    getFilterFromData(infoElement) || getFilterFromAnchor(infoElement);
  if (filter) {
    const [, nick, id] = filter
      .match(/(.*)(#[0-9]{8})$|(.*), ([0-9]{1,3}\.[0-9]{1,3})$|(.*)/)
      .filter((e) => e);

    return id || nick;
  }

  return infoElement.textContent.trim() || '알 수 없음';
}

export function getUserFilter(infoElement) {
  const filter =
    getFilterFromData(infoElement) || getFilterFromAnchor(infoElement);
  if (filter) {
    return filter;
  }

  return infoElement.textContent.trim() || '미상';
}

export function getUserIP(infoElement) {
  const filter =
    getFilterFromData(infoElement) || getFilterFromAnchor(infoElement);
  if (!filter) return '';

  return filter.match(/[0-9]{1,3}\.[0-9]{1,3}$/g)?.[0];
}

export function getUserKey(element, index) {
  const comment = element.closest('div.comment-item');
  if (comment) return comment.id;

  const article = element.closest('a.vrow');
  if (article) {
    const notice = article.classList.contains('notice');
    return `${notice ? 'n' : ''}a_${article.pathname.split('/')[3]}`;
  }

  return `$.${index}`;
}
