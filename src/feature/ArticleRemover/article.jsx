import { BOARD_ARTICLES_WITHOUT_NOTICE } from 'core/selector';
import { getUserInfo } from 'util/parser';

function getTarget(container, users, keywords) {
  const articles = [
    ...container.querySelectorAll(BOARD_ARTICLES_WITHOUT_NOTICE),
  ];

  const regUser = new RegExp(users.join('|') || '^$');
  const regKeyword = new RegExp(keywords.join('|') || '^$');

  return articles.filter((article) => {
    try {
      const title = article.querySelector('.col-title').innerText;
      const user = getUserInfo(article.querySelector('.user-info'));

      if (regUser.test(user) || regKeyword.test(title)) return true;

      return false;
    } catch (error) {
      return false;
    }
  });
}

function getArticleIDs(articles) {
  return articles.map(
    (article) => article.querySelector('.batch-check').dataset.id,
  );
}

export function remove(container, users, keywords) {
  const targets = getTarget(container, users, keywords);
  if (targets.length === 0) return;

  const articleIDs = getArticleIDs(targets);
  const form = document.querySelector('.batch-delete-form');
  form.querySelector('input[name="articleIds"]').value = articleIDs.join(',');
  form.submit();
}

export function test(container, users, keywords, classes) {
  const targets = getTarget(container, users, keywords);
  if (targets.length === 0) return;

  targets.forEach((article) => {
    article.classList.add(classes.target);
  });
}
