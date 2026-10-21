import { GM_xmlhttpRequest } from '$';

const parser = new DOMParser();

export function getDocument(source) {
  return parser.parseFromString(source, 'text/html');
}

/**
 *
 */
export function request(
  url,
  {
    method = 'GET',
    timeout = 0,
    responseType,
    data = null,
    onprogress = null,
  } = {},
) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method,
      timeout,
      // Tampermonkey : UTF-8 문서 파싱 관련 버그가 있음
      // AdGuard      : Greasemonkey와 동일하다고 설명하고 있으나 responseText가 빈 값으로 반환 됨
      responseType: responseType === 'document' ? '' : responseType,
      data,
      onprogress,
      onload: (response) => {
        if (response.status >= 400) {
          reject(new Error(`HTTP ${response.status}: ${url}`));
          return;
        }
        if (responseType === 'document') {
          resolve({
            ...response,
            response: getDocument(response.responseText),
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
