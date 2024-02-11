export function getUserNick(infoElement) {
  const data = infoElement.querySelector('[data-filter]')?.dataset.filter;
  if (data) {
    const [, nick, id] = data
      .match(/(.*)(#[0-9]{8})$|(.*), ([0-9]{1,3}\.[0-9]{1,3})$|(.*)/)
      .filter((e) => e);

    if (id?.includes('#')) {
      return `${nick}${id}`;
    }

    if (id?.includes('.')) {
      return `${nick}(${id})`;
    }

    return nick;
  }

  const anchor = infoElement.matches('a')
    ? infoElement
    : infoElement.querySelector('a');
  if (anchor) {
    const nick = anchor.title || anchor.textContent.replace('@', '');
    return nick || '';
  }

  return infoElement.textContent.trim() || '미상';
}

export function getUserID(infoElement) {
  const data = infoElement.querySelector('[data-filter]');
  if (data) {
    const [, nick, id] = data.dataset.filter
      .match(/(.*)(#[0-9]{8})$|(.*), ([0-9]{1,3}\.[0-9]{1,3})$|(.*)/)
      .filter((e) => e);

    return id || nick;
  }

  const anchor = infoElement.matches('a')
    ? infoElement
    : infoElement.querySelector('a');
  if (anchor) {
    const nick = anchor.title || anchor.textContent.replace('@', '');
    return nick || '';
  }

  return infoElement.textContent.trim() || '미상';
}

export function getUserFilter(infoElement) {
  const data = infoElement.querySelector('[data-filter]');
  if (data) {
    return data.dataset.filter;
  }

  const anchor = infoElement.querySelector('a');
  if (anchor) {
    const nick = anchor.title || anchor.textContent.replace('@', '');
    return nick || '';
  }

  return infoElement.textContent.trim() || '미상';
}

export function getUserIP(infoElement) {
  try {
    const data = infoElement.querySelector('[data-filter]').dataset.filter;
    const id = data.match(/[0-9]{1,3}\.[0-9]{1,3}$/g)[0];
    return id;
  } catch {
    return '';
  }
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
