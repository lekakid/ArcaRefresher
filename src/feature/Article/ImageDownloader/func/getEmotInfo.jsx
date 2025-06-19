export default function getEmotInfo(emoticonData) {
  const url = new URL(
    emoticonData.orig || emoticonData.imageUrl,
    window.location.origin,
  );

  const orig = url.toString();
  const thumb = orig;
  const ext = url.pathname.split('.').pop();
  const uploadName = url.pathname.match(/[0-9a-f]{64}/g)[0];

  return { orig, thumb, ext, uploadName };
}
