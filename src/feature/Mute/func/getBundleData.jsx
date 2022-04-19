export default async function getBundleData(id) {
  try {
    const response = await fetch(`/api/emoticon/${id}`);
    if (!response.ok) throw new Error('네트워크 오류');

    const data = await response.json();
    const emotList = data.map((i) => i.id);
    const urlList = data.map((i) => i.imageUrl);

    return { emotList, urlList };
  } catch (error) {
    console.warn('[Mute/getBundleData]', error);
    return { emotList: [], urlList: [] };
  }
}
