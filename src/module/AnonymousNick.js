import { ARTICLE_LOADED } from '../core/ArcaSelector';
import ArticleMenu from '../core/ArticleMenu';
import { waitForElement } from '../core/LoadManager';
import { parseUserID } from '../core/Parser';

export default { load };

const DefaultPrefix = [
  '웃는',
  '화난',
  '불쌍한',
  '즐거운',
  '건장한',
  '해탈한',
  '광기의',
  '귀여운',
  '곱슬머리',
  '개구쟁이',
  '자신있는',
  '방구석',
  '노래하는',
  '책읽는',
  '구르는',
  '비틀거리는',
  '힘든',
  '순수한',
  '행복한',
  '불닭먹는',
];
const DefaultSuffix = [
  '미호',
  '캬루',
  '둘리',
  '도바킨',
  '테레사',
  '윾돌이',
  '보노보노',
  '다비',
  '공룡',
  '아야',
];

async function load() {
  try {
    if (await waitForElement(ARTICLE_LOADED)) {
      addArticleMenu();
    }
  } catch (error) {
    console.error(error);
  }
}

function addArticleMenu() {
  ArticleMenu.addHeaderBtn({
    text: '익명화',
    icon: 'ion-wand',
    description: '게시물 작성자와 댓글 작성자를 일시적 익명으로 만듭니다.',
    onClick(event) {
      event.preventDefault();

      const userElements = document.querySelectorAll('.article-wrapper .user-info');
      const avatarElements = document.querySelectorAll('.article-wrapper .avatar');

      avatarElements.forEach((e) => {
        e.remove();
      });

      const users = new Set();
      userElements.forEach((e) => {
        users.add(parseUserID(e));
      });

      const alterNicks = new Set();
      let overcount = 1;

      while (alterNicks.size < users.size) {
        if (alterNicks.size < DefaultPrefix.length * DefaultSuffix.length) {
          const numPrefix = Math.floor(Math.random() * DefaultPrefix.length);
          const numSuffix = Math.floor(Math.random() * DefaultSuffix.length);
          alterNicks.add(`${DefaultPrefix[numPrefix]} ${DefaultSuffix[numSuffix]}`);
        } else {
          alterNicks.add(`비둘기 ${`${(overcount += 1)}`.padStart(4, '0')}`);
        }
      }
      const alterTable = {};
      for (let i = 0; i < users.size; i += 1) {
        alterTable[[...users][i]] = [...alterNicks][i];
      }

      userElements.forEach((e) => {
        e.textContent = alterTable[parseUserID(e)];
      });
    },
  });
}
