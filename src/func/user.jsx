export class User {
  static TYPE_FIXED = 'FIXED';
  static TYPE_HALF = 'HALF';
  static TYPE_IP = 'IP';

  constructor(containerEl) {
    let filter;
    const infoEl = containerEl.matches('[data-filter]')
      ? containerEl
      : containerEl.querySelector('[data-filter]');
    filter = infoEl?.dataset.filter;

    if (!filter) {
      const anchorEl = containerEl.matches('a')
        ? containerEl
        : containerEl.querySelector('a');
      filter = anchorEl?.title || anchorEl?.textContent.replace('@', '');
    }

    if (!filter) throw new Error('[User] 이용자 정보를 찾을 수 없음');

    const [, nick, id] = filter
      .match(/(.*)(#[0-9]{8})$|(.*), ([0-9]{1,3}\.[0-9]{1,3})$|(.*)/)
      .filter((e) => e);

    // 고정닉
    this.type = User.TYPE_FIXED;

    // 반고닉
    if (id?.includes('#')) {
      this.type = User.TYPE_HALF;
    }

    // 유동
    if (id?.includes('.')) {
      this.type = User.TYPE_IP;
    }

    this.nick = nick;
    this.id = id;
  }

  toString() {
    switch (this.type) {
      case User.TYPE_FIXED:
        return this.nick;
      case User.TYPE_HALF:
        return `${this.nick}${this.id}`;
      case User.TYPE_IP:
        return `${this.nick}(${this.id})`;
      default:
        return '';
    }
  }

  toUID() {
    switch (this.type) {
      case User.TYPE_FIXED:
        return this.nick;
      case User.TYPE_HALF:
      case User.TYPE_IP:
        return this.id;
      default:
        return '';
    }
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
