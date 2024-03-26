export default async function getBundleId(emotId) {
  const response = await fetch(`/api/emoticon/shop/${emotId}`, {
    method: 'HEAD',
  });
  if (!response.redirected)
    throw new Error(
      `이모티콘(${emotId})이 포함된 번들 페이지를 조회하는데 실패했습니다.`,
    );

  return response.url.match(/[0-9]+$/)[0];
}
