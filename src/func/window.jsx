export const FOREGROUND = 'foreground';
export const BACKGROUND = 'background';
export const CURRENT = 'current';

export function open(url, type) {
  switch (type) {
    case FOREGROUND:
      GM_openInTab(url, false);
      break;
    case BACKGROUND:
      GM_openInTab(url, true);
      break;
    case CURRENT:
    default:
      window.location.href = url;
      break;
  }
}
