export function getArcaMediaURL(url, type) {
  const typeQuery = type ? `?type=${type}` : '';

  const regex = /ac[0-9]*\.namu\.la/;
  if (regex.test(url)) {
    return `${url.replace('.namu.la', '-p.namu.la')}${typeQuery}`;
  }
  return `${url}${typeQuery}`;
}
