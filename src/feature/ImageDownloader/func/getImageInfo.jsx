import { getArcaMediaURL } from 'func/url';

function getGifInfo(gif) {
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

function getImageInfo(image) {
  if (image.tagName === 'VIDEO') return getGifInfo(image);

  // 드물게 search가 남은 경우 제거
  const url = image.src.split('?')[0];

  const orig = getArcaMediaURL(url, 'orig');
  const thumb = url;
  const ext = url.match(/\.(.{3,4})$/)[1];
  const uploadName = url.match(/[0-9a-f]{64}/g)[0];

  return { orig, thumb, ext, uploadName };
}

export default getImageInfo;
