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

export function getUserID(infoElement) {
  try {
    const data = infoElement.querySelector('[data-filter]').dataset.filter;
    const [, nick, id] = data
      .match(/(.*)(#[0-9]{8})$|(.*), ([0-9]{1,3}\.[0-9]{1,3})$|(.*)/)
      .filter((e) => e);

    return id || nick;
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
