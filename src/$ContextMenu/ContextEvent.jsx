export const IMAGE_MENU = 'IMAGE_MENU';
export const TEMP = 'TEMP';

export function EventContextItemPair(eventType, Component) {
  return { eventType, Component };
}

function ContextEvent(eventType, test, getData) {
  return { eventType, test, getData };
}

function testOnClickImg(e) {
  return !!e.target.closest('img, video:not([controls])');
}

function getImgData(e) {
  const url = e.target.src.split('?')[0];

  const orig = `${url}${e.target.tagName === 'VIDEO' ? '.gif' : ''}?type=orig`;
  const thumb = `${url}${e.target.tagName === 'VIDEO' ? '.gif' : ''}`;
  const [, ext] =
    e.target.tagName === 'VIDEO' ? [0, 'gif'] : url.match(/\.(.{3,4})$/);
  const [uploadName] = url.match(/[0-9a-f]{64}/g);

  return { orig, thumb, ext, uploadName };
}

function testTemp() {
  return false;
}

const EventTest = [
  ContextEvent(IMAGE_MENU, testOnClickImg, getImgData),
  ContextEvent(TEMP, testTemp, testTemp),
];

export default EventTest;
