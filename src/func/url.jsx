export function getArcaMediaURL(url, type) {
  const urlQuery = type && `?type=${type}`;
  const originServer =
    url.includes('-p') ? url : url.replace('.namu.la', '-p.namu.la');
  return `${originServer}${urlQuery}`;
}
