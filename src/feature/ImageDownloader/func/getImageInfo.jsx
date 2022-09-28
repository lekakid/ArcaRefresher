import { getArcaMediaURL } from 'func/url';

export default function getImageInfo(image) {
  // 드물게 search가 남은 경우 제거
  const url = image.src.split('?')[0];

  const orig = getArcaMediaURL(url, 'orig');
  const thumb = url;
  const ext = url.match(/\.(.{3,4})$/)[1];
  const uploadName = url.match(/[0-9a-f]{64}/g)[0];

  return { orig, thumb, ext, uploadName };
}
