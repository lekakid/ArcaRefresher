export default function filterContent(contents, filter) {
  const filteredList = {
    user: [],
    keyword: [],
    category: [],
    preview: [],
    channel: [],
    deleted: [],
    all: [],
  };

  const arcaUser = unsafeWindow.LiveConfig?.mute?.users || [];
  const arcaKeyword = unsafeWindow.LiveConfig?.mute?.keywords || [];

  const mergedUser = [...arcaUser, ...filter.user];
  const mergedKeyword = [...arcaKeyword, ...filter.keyword];

  const regexUser =
    mergedUser.length > 0 ? new RegExp(mergedUser.join('|')) : undefined;
  const regexKeyword =
    mergedKeyword.length > 0 ? new RegExp(mergedKeyword.join('|')) : undefined;
  const regexChannel =
    filter.channel?.length > 0
      ? new RegExp(filter.channel.join('|'))
      : undefined;

  contents.forEach(({ element, user, content, channel, category, deleted }) => {
    let filtered = false;
    // 이용자 뮤트 처리
    if (regexUser?.test(user)) {
      filteredList.user.push(element);
      filtered = true;
    }

    // 키워드 뮤트 처리
    if (regexKeyword?.test(content)) {
      filteredList.keyword.push(element);
      filtered = true;
    }

    // [게시판 한정] 카테고리 뮤트 처리
    if (filter.category?.[category]?.muteArticle) {
      filteredList.category.push(element);
      filtered = true;
    }

    // [게시판 한정] 게시물 미리보기 뮤트 처리
    if (filter.category?.[category]?.mutePreview) {
      filteredList.preview.push(element);
    }

    // [특수 게시판 한정] 특정 채널 게시물 뮤트
    if (regexChannel?.test(channel)) {
      filteredList.channel.push(element);
      filtered = true;
    }

    // [댓글 한정] 삭제된 댓글 뮤트 처리
    if (deleted) {
      filteredList.deleted.push(element);
      filtered = true;
    }

    // 카운트 용
    if (filtered) {
      filteredList.all.push(element);
    }
  });

  return filteredList;
}
