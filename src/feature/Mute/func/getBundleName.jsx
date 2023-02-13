export default async function getBundleInfo(bundleID) {
  const response = await fetch(`/e/${bundleID}`);
  if (!response.ok) {
    return `삭제된 이모티콘 - ${bundleID}`;
  }

  const text = await response.text();
  const parser = new DOMParser();
  const bundleDocument = parser.parseFromString(text, 'text/html');

  return bundleDocument.title;
}
