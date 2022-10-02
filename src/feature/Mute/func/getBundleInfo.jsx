export default async function getBundleInfo(emotID) {
  const response = await fetch(`/api/emoticon/shop/${emotID}`);
  if (!response.redirected)
    throw new Error(
      `이모티콘(${emotID})이 포함된 번들 페이지를 조회하는데 실패했습니다.`,
    );

  const text = await response.text();
  const parser = new DOMParser();
  const bundleDocument = parser.parseFromString(text, 'text/html');

  const id = response.url.match(/[0-9]+$/)[0];
  const name =
    bundleDocument.querySelector('.article-head .title')?.textContent.trim() ||
    `삭제된 이모티콘 - ${id}`;
  return { id, name };
}
