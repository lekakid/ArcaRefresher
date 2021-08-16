export const TypeString = {
  keyword: '키워드',
  user: '사용자',
  category: '카테고리',
  deleted: '삭제됨',
  all: '전체',
};

export default function filterContent(
  contents,
  userList,
  keywordList,
  categoryList,
  categoryPair,
) {
  const count = Object.keys(TypeString).reduce(
    (acc, cur) => ({ ...acc, [cur]: 0 }),
    {},
  );

  const { mute: { users: arcaUser = [], keywords: arcaKeyword = [] } = {} } =
    unsafeWindow.LiveConfig || {};
  const config = {
    user: [...new Set([...arcaUser, ...userList])],
    keyword: [...new Set([...arcaKeyword, ...keywordList])],
    category: categoryList || {},
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

    if (
      categoryPair[category] &&
      config.category[categoryPair[category]]?.muteArticle
    ) {
      element.classList.add('filtered', 'filtered-category');
      count.category += 1;
      count.all += 1;
    } else {
      element.classList.remove('filtered', 'filtered-category');
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
