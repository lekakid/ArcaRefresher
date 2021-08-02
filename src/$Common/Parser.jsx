import { BOARD_CATEGORIES, CHANNEL_TITLE } from './Selector';

export function getChannelID() {
  try {
    const { pathname } = window.location;
    return pathname.match(/\/b\/([0-9a-zA-Z]{4,20})/)[1].toLowerCase();
  } catch (error) {
    return '';
  }
}

export function getChannelName() {
  const channelTitle = document.querySelector(CHANNEL_TITLE);
  return channelTitle ? channelTitle.textContent : '';
}

export function getCategory(isReverseMap) {
  const channelCategoryList = document.querySelectorAll(BOARD_CATEGORIES);
  const result = {};
  channelCategoryList.forEach((e) => {
    if (e.href.indexOf('category=') > -1) {
      const id = decodeURI(e.href.split('category=')[1].split('&')[0]);
      const text = e.textContent;
      if (isReverseMap) {
        result[text] = id;
      } else {
        result[id] = text;
      }
    } else {
      result['일반'] = '일반';
    }
  });
  return result;
}

export function getUserInfo(infoElement) {
  try {
    const data = infoElement.querySelector('[data-filter]').dataset.filter;
    return data;
  } catch (error) {
    return '';
  }
}

export function getUserNick(infoElement) {
  try {
    const data = infoElement.querySelector('[data-filter]').dataset.filter;
    const [, nick, id] = data
      .match(/(.*)(#[0-9]{8})$|(.*), ([0-9]{1,3}\.[0-9]{1,3})$|(.*)/)
      .filter((e) => e);

    if (id?.indexOf('#') > -1) {
      return `${nick}${id}`;
    }

    if (id?.indexOf('.') > -1) {
      return `${nick}(${id})`;
    }

    return nick;
  } catch (error) {
    return '';
  }
}

export function getUserIP(infoElement) {
  try {
    const data = infoElement.querySelector('[data-filter]').dataset.filter;
    const id = data.match(/[0-9]{1,3}\.[0-9]{1,3}$/g)[0];

    return id;
  } catch (error) {
    return '';
  }
}
