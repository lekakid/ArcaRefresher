export default function fetch({
  url,
  method = 'GET',
  timeout = 0,
  responseType = 'text',
  data = null,
  onprogress = null,
  onload,
  ontimeout,
  onerror,
}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method,
      timeout,
      responseType,
      data,
      onprogress,
      onload:
        onload ||
        ((response) => {
          if (responseType === 'document') {
            resolve({
              ...response,
              response: new DOMParser().parseFromString(
                response.responseText,
                'text/html',
              ),
            });
            return;
          }
          resolve(response);
        }),
      ontimeout:
        ontimeout ||
        ((error) => {
          reject(error);
        }),
      onerror:
        onerror ||
        ((error) => {
          reject(error);
        }),
    });
  });
}
