export default function trimEmotURL(url) {
  return url
    .split('.la/')[1]
    .split('?')[0]
    .replace('.gif', '.mp4')
    .replace('.mp4.mp4', '.mp4');
}
