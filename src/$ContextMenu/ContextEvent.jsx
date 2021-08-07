import { getUserID } from '../$Common/Parser';

export const IMAGE_MENU = 'IMAGE_MENU';
export const USER_MENU = 'USER_MENU';

export function EventContextItemPair(eventType, menu) {
  return { eventType, menu };
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

function testOnClickUserInfo(e) {
  return !!e.target.closest('span.user-info');
}

function getUserInfoData(e) {
  const userInfo = e.target.closest('span.user-info');

  const id = getUserID(userInfo);

  return { id };
}

const EventTest = [
  ContextEvent(IMAGE_MENU, testOnClickImg, getImgData),
  ContextEvent(USER_MENU, testOnClickUserInfo, getUserInfoData),
];

export default EventTest;
