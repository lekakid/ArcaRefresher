export default function getImageInfo(image) {
  const url = image.src || image.dataset.src;
  const igImageTag = image.tagName === 'IMG';

  const orig = `${
    (igImageTag ? url : image.dataset.originalurl) || url
  }&type=orig`;
  const thumb = igImageTag ? url : image.poster;
  const ext = orig.split('?')[0].substr(-10, 10).split('.').pop();
  const uploadName = url.match(/[0-9a-f]{64}/g)[0];

  return { orig, thumb, ext, uploadName };
}
