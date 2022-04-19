export default async function getBundleInfo(emotID) {
  try {
    const response = await fetch(`/api/emoticon/shop/${emotID}`);
    if (!response.ok) throw new Error('네트워크 오류');

    const text = await response.text();
    const parser = new DOMParser();
    const bundleDocument = parser.parseFromString(text, 'text/html');

    const id = response.url.match(/[0-9]+$/)[0];
    const name =
      bundleDocument
        .querySelector('.article-head .title')
        ?.textContent.trim() || `삭제된 이모티콘 - ${id}`;
    return { id, name };
  } catch (error) {
    console.warn('[Mute/getBundleInfo] 번들 정보 받기 실패', error);
    return { id: 0, name: '번들 정보 없음' };
  }
}
