import fetch from 'util/fetch';

export default async function getBundleData(id) {
  try {
    const { response } = await fetch({
      url: `/api/emoticon/${id}`,
      method: 'GET',
      responseType: 'json',
    });
    const emotList = response.map((i) => i.id);
    const urlList = response.map((i) => i.imageUrl);

    return { emotList, urlList };
  } catch (error) {
    return { emotList: [], urlList: [] };
  }
}
