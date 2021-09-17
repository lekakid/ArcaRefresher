export default function filterContent(
  contents,
  userList,
  keywordList,
  categoryList,
  categoryPair,
) {
  const count = {
    keyword: 0,
    user: 0,
    category: 0,
    deleted: 0,
    all: 0,
  };

  const { mute: { users: arcaUser = [], keywords: arcaKeyword = [] } = {} } =
    unsafeWindow.LiveConfig || {};
  const config = {
    user: [...arcaUser, ...userList],
    keyword: [...arcaKeyword, ...keywordList],
    category: categoryList,
  };

  contents.forEach(({ element, user, content, category }) => {
    if (config.user.length && new RegExp(config.user.join('|')).test(user)) {
      element.classList.add('filtered', 'filtered-user');
      count.user += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered', 'filtered-user');
    }

    if (
      config.keyword.length &&
      new RegExp(config.keyword.join('|')).test(content)
    ) {
      element.classList.add('filtered', 'filtered-keyword');
      count.keyword += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered', 'filtered-keyword');
    }

    if (config.category[categoryPair[category]]?.muteArticle) {
      element.classList.add('filtered', 'filtered-category');
      count.category += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered', 'filtered-category');
    }

    if (config.category[categoryPair[category]]?.mutePreview) {
      element.classList.add('block-preview');
    } else {
      element.classList.remove('block-preview');
    }

    if (element.classList.contains('deleted')) {
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
