export default function trimEmotURL(urlString) {
  const url = new URL(urlString, 'https://a');
  const result = url.pathname
    .replace('.gif', '.mp4')
    .replace('.mp4.mp4', '.mp4');
  return result;
}
