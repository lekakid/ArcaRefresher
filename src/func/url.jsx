export function getArcaMediaURL(url, type) {
  const urlQuery = type ? `?type=${type}` : '?';
  const originServer =
    url.indexOf('-p') < 0 ? url.replace('.namu.la', '-p.namu.la') : url;
  return `${originServer}${urlQuery}`;
}
