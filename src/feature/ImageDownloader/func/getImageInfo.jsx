function getGifInfo(gif) {
  // 드물게 search가 남은 경우 제거
  const url = gif.src.split('?')[0];
  const { version } = gif.dataset;
  const ext = 'gif';
  const uploadName = url.match(/[0-9a-f]{64}/g)[0];

  if (version !== 'v2' && !gif.poster) {
    const orig = `${url}.gif?type=orig`;
    const thumb = `${url}.gif?type=list`;

    return { orig, thumb, ext, uploadName };
  }

  const orig = `${url.replace('mp4', 'gif')}?type=orig`;
  const thumb = `${url.replace('mp4', 'gif')}?type=list`;

  return { orig, thumb, ext, uploadName };
}

function getImageInfo(image) {
  if (image.tagName === 'VIDEO') return getGifInfo(image);

  // 드물게 search가 남은 경우 제거
  const url = image.src.split('?')[0];

  const orig = `${url}?type=orig`;
  const thumb = url;
  const ext = url.match(/\.(.{3,4})$/)[1];
  const uploadName = url.match(/[0-9a-f]{64}/g)[0];

  return { orig, thumb, ext, uploadName };
}

export default getImageInfo;
