import httpRequest from 'util/httpRequest';

async function getBlob({ url, onprogress }) {
  try {
    const fetchResponse = await fetch(url);
    if (fetchResponse.ok) {
      if (!onprogress) return fetchResponse.blob();

      const total = fetchResponse.headers.get('Content-Length');
      const reader = fetchResponse.body.getReader();
      let loaded = 0;
      const chunks = [];

      await reader.read().then(function process({ done, value }) {
        if (done) return undefined;

        chunks.push(value);
        loaded += value.length;
        onprogress({ loaded, total });
        return reader.read().then(process);
      });

      return new Blob(chunks);
    }
  } catch (error) {
    console.info(`[ImageDownloader/getBlob] fetch 실패 (${url})`);
  }

  const httpRequestResponse = await httpRequest({
    url,
    responseType: 'blob',
    onprogress,
  });
  return httpRequestResponse.response;
}

export default getBlob;
