import toDocument from './toDocument';

/**
 * CORS 우회 용도 외엔 최소한으로 사용할 것
 */
export function request(
  url,
  {
    method = 'GET',
    timeout = 0,
    responseType = 'document',
    data = null,
    onprogress = null,
  } = {},
) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method,
      timeout,
      responseType,
      data,
      onprogress,
      onload: (response) => {
        if (responseType === 'document') {
          resolve({
            ...response,
            response: toDocument(response.responseText),
          });
          return;
        }
        resolve(response);
      },
      ontimeout: (error) => {
        reject(error);
      },
      onerror: (error) => {
        reject(error);
      },
    });
  });
}

export function getQuery(search) {
  const entries = (search || window.location.search)
    .substring(1)
    .split('&')
    .filter((e) => e)
    .map((e) => e.split('='));
  return Object.fromEntries(entries);
}

export function stringifyQuery(query) {
  let search = `?${Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`;
  if (search === '?') search = '';

  return search;
}
