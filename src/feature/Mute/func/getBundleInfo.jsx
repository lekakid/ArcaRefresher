import fetch from 'util/fetch';

export default async function getBundleInfo(emotID) {
  const { finalUrl: bundleURL, response: bundleDocument } = await fetch({
    url: `/api/emoticon/shop/${emotID}`,
    method: 'GET',
    timeout: 10000,
    responseType: 'document',
  });
  const id = bundleURL.match(/[0-9]+$/)[0];
  const name =
    bundleDocument.querySelector('.article-head .title')?.textContent.trim() ||
    `삭제된 이모티콘 - ${id}`;

  return { id, name };
}
