export default function filterContent({
  contents,
  userList,
  keywordList,
  categoryList,
  categoryMap,
}) {
  const count = {
    keyword: 0,
    user: 0,
    category: 0,
    deleted: 0,
    all: 0,
  };

  const { mute: { users: arcaUser = [], keywords: arcaKeyword = [] } = {} } =
    unsafeWindow.LiveConfig || {};
  const filter = {
    user: Boolean(arcaUser.length + userList.length),
    userRegex: new RegExp([...arcaUser, ...userList].join('|')),
    keyword: Boolean(arcaKeyword.length + keywordList.length),
    keywordRegex: new RegExp([...arcaKeyword, ...keywordList].join('|')),
    category: categoryList,
  };

  contents.forEach(({ element, user, content, category }) => {
    if (filter.user && filter.userRegex.test(user)) {
      element.classList.add('filtered', 'filtered-user');
      count.user += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered', 'filtered-user');
    }

    if (filter.keyword && filter.keywordRegex.test(content)) {
      element.classList.add('filtered', 'filtered-keyword');
      count.keyword += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered', 'filtered-keyword');
    }

    const categoryID = categoryMap[category];
    if (filter.category[categoryID]?.muteArticle) {
      element.classList.add('filtered', 'filtered-category');
      count.category += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered', 'filtered-category');
    }

    if (filter.category[categoryID]?.mutePreview) {
      element.classList.add('block-preview');
    } else {
      element.classList.remove('block-preview');
    }

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
