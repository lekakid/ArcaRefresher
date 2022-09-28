import { getArcaMediaURL } from 'func/url';

export default function getGifInfo(gif) {
  // 드물게 search가 남은 경우 제거
  const url = (gif.src || gif.dataset.src).split('?')[0];
  const ext = 'gif';
  const uploadName = url.match(/[0-9a-f]{64}/g)[0];

  let orig;
  let thumb;

  if (!gif.poster) {
    orig = getArcaMediaURL(`${url}.gif`, 'orig');
    thumb = getArcaMediaURL(`${url}.gif`, 'list');
  } else {
    orig = getArcaMediaURL(url.replace('mp4', 'gif'), 'orig');
    thumb = getArcaMediaURL(url.replace('mp4', 'gif'), 'list');
  }

  return { orig, thumb, ext, uploadName };
}
