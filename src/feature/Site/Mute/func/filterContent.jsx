export default function filterContent(
  contents,
  { userList, keywordList, categoryOpt, categoryNameMap },
) {
  const count = {
    keyword: 0,
    user: 0,
    category: 0,
    deleted: 0,
    all: 0,
  };

  const arcaUser = unsafeWindow.LiveConfig?.mute?.users || [];
  const arcaKeyword = unsafeWindow.LiveConfig?.mute?.keywords || [];

  const mergedUser = [...arcaUser, ...userList];
  const mergedKeyword = [...arcaKeyword, ...keywordList];

  const regexUser =
    mergedUser.length > 0 ? new RegExp(mergedUser.join('|')) : undefined;
  const regexKeyword =
    mergedKeyword.length > 0 ? new RegExp(mergedKeyword.join('|')) : undefined;

  contents.forEach(({ element, user, content, category }) => {
    // 이용자 뮤트 처리
    if (regexUser?.test(user)) {
      element.classList.add('filtered-user');
      count.user += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered-user');
    }

    // 키워드 뮤트 처리
    if (regexKeyword?.test(content)) {
      element.classList.add('filtered-keyword');
      count.keyword += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered-keyword');
    }

    const categoryID = categoryNameMap?.[category];

    // [게시판 한정] 카테고리 뮤트 처리
    if (categoryOpt?.[categoryID]?.muteArticle) {
      element.classList.add('filtered-category');
      count.category += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered-category');
    }

    // [게시판 한정] 게시물 미리보기 뮤트 처리
    if (categoryOpt?.[categoryID]?.mutePreview) {
      element.classList.add('block-preview');
    } else {
      element.classList.remove('block-preview');
    }

    // [댓글 한정] 삭제된 댓글 뮤트 처리
    const commentTarget = element.matches('.comment-wrapper')
      ? element.firstElementChild
      : element;
    if (commentTarget.classList.contains('deleted')) {
      element.classList.add('filtered', 'filtered-deleted');
      count.deleted += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered', 'filtered-deleted');
    }

    if (element.className.indexOf('filtered-') > -1) {
      element.classList.add('filtered');
    }
  });

  return count;
}
