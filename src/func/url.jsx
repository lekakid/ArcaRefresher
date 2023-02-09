export function getArcaMediaURL(url, type) {
  // 아카 이미지 서버 CORS 대응, '?' 없애지 마세요
  const urlQuery = type ? `?type=${type}` : '?';
  const originServer = url.includes('-p')
    ? url
    : url.replace('.namu.la', '-p.namu.la');
  return `${originServer}${urlQuery}`;
}
