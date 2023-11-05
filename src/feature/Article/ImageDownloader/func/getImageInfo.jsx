export default function getImageInfo(image) {
  const url = image.src || image.dataset.src;
  const igImageTag = image.tagName === 'IMG';

  const base = 'https://arca.live/';

  const orig = new URL(
    `${(igImageTag ? url : image.dataset.originalurl) || url}&type=orig`,
    base,
  ).toString();
  const thumb = new URL(igImageTag ? url : image.poster, base).toString();
  const ext = orig.split('?')[0].substr(-10, 10).split('.').pop();
  const uploadName = url.match(/[0-9a-f]{64}/g)[0];

  return { orig, thumb, ext, uploadName };
}
