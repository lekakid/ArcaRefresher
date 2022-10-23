import { getArcaMediaURL } from 'func/url';

export default function getGifInfo(gif) {
  // 드물게 search가 남은 경우 제거
  const url = (gif.src || gif.dataset.src).split('?')[0];
  const ext = 'gif';
  const uploadName = url.match(/[0-9a-f]{64}/g)[0];

  let orig;
  let thumb;

  // v2
  if (url.indexOf('sac') > -1 || gif.dataset.src) {
    orig = getArcaMediaURL(url.replace('mp4', 'gif'), 'orig');
    thumb = getArcaMediaURL(url.replace('mp4', 'gif'), 'list');
  }
  // v1
  else {
    orig = getArcaMediaURL(`${url}.gif`, 'orig');
    thumb = getArcaMediaURL(`${url}.gif`, 'list');
  }

  return { orig, thumb, ext, uploadName };
}
