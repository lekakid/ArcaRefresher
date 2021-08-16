import fetch from '../$Common/Fetch';

export default async function getEmoticonInfo(id) {
  const { finalUrl: bundleURL, response: bundleDocument } = await fetch({
    url: `/api/emoticon/shop/${id}`,
    method: 'GET',
    timeout: 10000,
    responseType: 'document',
  });
  const bundleID = bundleURL.match(/[0-9]+$/)[0];
  const name =
    bundleDocument.querySelector('.article-head .title')?.textContent.trim() ||
    `삭제된 이모티콘 - ${bundleID}`;
  try {
    const { response } = await fetch({
      url: `/api/emoticon/${bundleID}`,
      method: 'GET',
      responseType: 'json',
    });
    const bundle = response.map((i) => i.id);
    const url = response.map((i) => i.imageUrl);

    return { bundleID, name, bundle, url };
  } catch (error) {
    return { bundleID, name, bundle: [], url: [] };
  }
}
