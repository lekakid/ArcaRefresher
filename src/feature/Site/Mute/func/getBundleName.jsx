import { getDocument } from 'func/http';

export default async function getBundleName(bundleId) {
  const response = await fetch(`/e/${bundleId}`);
  if (!response.ok) {
    return `삭제된 이모티콘 (${bundleId})`;
  }

  if (response.url.includes('/u/login')) {
    return `이모티콘 번들 (${bundleId})`;
  }

  const text = await response.text();
  const bundleDocument = getDocument(text);

  return bundleDocument.title;
}
