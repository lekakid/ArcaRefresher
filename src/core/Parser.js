const CHANNEL_TITLE = '.board-title a:not([class])';

export function parseChannelID() {
  try {
    const pathname = window.location.pathname;
    return pathname
      .match(/\/b\/[0-9a-zA-Z]{4,20}/g)[0]
      .replace('/b/', '')
      .toLowerCase();
  } catch (error) {
    return '';
  }
}

export function parseChannelTitle() {
  const channelTitle = document.querySelector(CHANNEL_TITLE);
  return channelTitle ? channelTitle.textContent : '';
}

export function parseUserInfo(infoElement) {
  if (infoElement.dataset.info) {
    return infoElement.dataset.info;
  }

  const dataElement = infoElement.querySelector('[data-filter]');
  const data = dataElement.dataset.filter;
  const id = data.match(/#[0-9]{8}|[0-9]{1,3}\.[0-9]{1,3}|^[^,#]+$/g)[0];

  let info;
  if (data.indexOf('#') > -1) {
    info = `${dataElement.textContent}${id}`;
  }
  if (data.indexOf(',') > -1) {
    info = `${dataElement.textContent}(${id})`;
  } else {
    info = id;
  }

  infoElement.dataset.info = info;
  return info;
}

export function parseUserID(infoElement) {
  if (infoElement.dataset.id) {
    return infoElement.dataset.id;
  }

  const data = infoElement.querySelector('[data-filter]').dataset.filter;
  let id = data.match(/#[0-9]{8}|[0-9]{1,3}\.[0-9]{1,3}|^[^,#]+$/g)[0];

  if (data.indexOf(',') > -1) {
    id = `(${id})`;
  }

  infoElement.dataset.id = id;
  return id;
}
