export default function getImageInfo(image) {
  // 변환된 GIF || GIF 아카콘 || 일반적인 경우
  const url = new URL(
    image.dataset.originalurl || image.dataset.src || image.src,
    window.location.origin,
  );
  const targetServer = unsafeWindow.LiveConfig.original || url.host;

  const orig = new URL(
    `https://${targetServer}${url.pathname}${url.search}&type=orig`,
  ).toString();
  const thumb = new URL(image.poster || url).toString();
  const ext = url.pathname.split('.').pop();
  const uploadName = url.pathname.match(/[0-9a-f]{64}/g)[0];

  return { orig, thumb, ext, uploadName };
}
