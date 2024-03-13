import trimEmotURL from './trimEmotURL';

export default async function getEmoticonList(bundleId) {
  const response = await fetch(`/api/emoticon/${bundleId}`);
  if (!response.ok)
    throw new Error(
      `번들(${bundleId}) 이모티콘 목록을 받아오는데 실패했습니다.`,
    );

  const data = await response.json();
  const idList = data.map((i) => i.id);
  const urlList = data.map((i) => trimEmotURL(i.imageUrl));

  return { idList, urlList };
}
