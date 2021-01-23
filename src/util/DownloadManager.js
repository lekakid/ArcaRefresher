export function getBlob(url, onProgress, onLoad) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'blob',
      onprogress: (event) => {
        if (onProgress) onProgress(event);
      },
      onload: (response) => {
        if (onLoad) onLoad();
        resolve(response.response);
      },
      onerror: (error) => {
        reject(new Error('이미지 blob 다운로드 중 오류 발생', error));
      },
    });
  });
}

export function getArrayBuffer(url, onProgress, onLoad) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      onprogress: (event) => {
        if (onProgress) onProgress(event);
      },
      onload: (response) => {
        if (onLoad) onLoad();
        resolve(response.response);
      },
      onerror: (error) => {
        reject(new Error('이미지 arraybuffer 다운로드 중 오류 발생', error));
      },
    });
  });
}
