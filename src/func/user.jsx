export class ArcaUser {
  static TYPE_FIXED = 'FIXED';
  static TYPE_HALF = 'HALF';
  static TYPE_IP = 'IP';
  static TYPE_ERROR = 'ERROR';

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

    if (!filter) {
      filter = containerEl.textContent.trim();
    }

    const [, nick, id] = filter
      .match(/(.*)(#[0-9]{8})$|(.*), ([0-9]{1,3}\.[0-9]{1,3})$|(.*)/)
      .filter((e) => e);

    // 고정닉
    this.type = ArcaUser.TYPE_FIXED;

    // 반고닉
    if (id?.includes('#')) {
      this.type = ArcaUser.TYPE_HALF;
    }

    // 유동
    if (id?.includes('.')) {
      this.type = ArcaUser.TYPE_IP;
    }

    this.nick = nick;
    this.id = id;
  }

  toString() {
    switch (this.type) {
      case ArcaUser.TYPE_FIXED:
        return this.nick;
      case ArcaUser.TYPE_HALF:
        return `${this.nick}${this.id}`;
      case ArcaUser.TYPE_IP:
        return `${this.nick}(${this.id})`;
      default:
        return '';
    }
  }

  toUID() {
    switch (this.type) {
      case ArcaUser.TYPE_FIXED:
        return this.nick;
      case ArcaUser.TYPE_HALF:
      case ArcaUser.TYPE_IP:
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
