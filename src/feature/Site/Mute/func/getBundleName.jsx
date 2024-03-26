import toDocument from 'func/toDocument';

export default async function getBundleName(bundleId) {
  const response = await fetch(`/e/${bundleId}`);
  if (!response.ok) {
    return `삭제된 이모티콘 - ${bundleId}`;
  }

  const text = await response.text();
  const bundleDocument = toDocument(text);

  return bundleDocument.title;
}
