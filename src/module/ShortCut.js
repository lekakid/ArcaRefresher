import { ARTICLE_LOADED, BOARD_LOADED } from '../core/ArcaSelector';
import { addSetting, getValue, setValue } from '../core/Configure';
import { waitForElement } from '../core/LoadManager';

export default { load };

const USE_SHORTCUT = { key: 'useShortcut', defaultValue: false };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(ARTICLE_LOADED)) {
      apply('article');
    } else if (await waitForElement(BOARD_LOADED)) {
      apply('board');
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const shortCut = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  addSetting({
    header: '단축키',
    group: [
      {
        title: '단축키 사용',
        description: (
          <a
            href="https://github.com/lekakid/ArcaRefresher/wiki/Feature#%EB%8B%A8%EC%B6%95%ED%82%A4%EB%A1%9C-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EB%8F%99"
            target="_blank"
            rel="noreferrer"
          >
            단축키 안내 바로가기
          </a>
        ),
        content: shortCut,
      },
    ],
    valueCallback: {
      save() {
        setValue(USE_SHORTCUT, shortCut.value === 'true');
      },
      load() {
        shortCut.value = getValue(USE_SHORTCUT);
      },
    },
  });
}

function apply(view) {
  if (!getValue(USE_SHORTCUT)) return;

  if (view === 'article') {
    document.addEventListener('keydown', onArticle);
  } else if (view === 'board') {
    document.addEventListener('keydown', onBoard);
  }
}

function onArticle(event) {
  // A 목록 바로가기
  // E 추천
  // R 댓글 목록보기
  // W 댓글 입력 포커스

  if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') return;

  switch (event.code) {
    case 'KeyA':
      event.preventDefault();
      window.location.pathname = window.location.pathname.replace(/\/[0-9]+/, '');
      break;
    case 'KeyE':
      event.preventDefault();
      document.querySelector('#rateUp').click();
      break;
    case 'KeyR': {
      event.preventDefault();
      const commentForm = document.querySelector('.article-comment');
      window.scrollTo({ top: commentForm.offsetTop - 50, behavior: 'smooth' });
      break;
    }
    case 'KeyW': {
      event.preventDefault();
      const inputForm = document.querySelector('.article-comment .subtitle');
      const input = document.querySelector('.article-comment .input textarea');
      const top = window.pageYOffset + inputForm.getBoundingClientRect().top;
      window.scrollTo({ top: top - 50, behavior: 'smooth' });
      input.focus({ preventScroll: true });
      break;
    }
    default:
      break;
  }
}

function onBoard(event) {
  // W 게시물 쓰기
  // E 헤드라인
  // D 이전 페이지
  // F 다음 페이지

  if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') return;

  switch (event.code) {
    case 'KeyW': {
      event.preventDefault();
      const path = window.location.pathname.split('/');
      let writePath = '';
      if (path[path.length - 1] === '') {
        path[path.length - 1] = 'write';
      } else {
        path.push('write');
      }
      writePath = path.join('/');
      window.location.pathname = writePath;
      break;
    }
    case 'KeyE': {
      event.preventDefault();
      if (window.location.search.indexOf('mode=best') > -1) {
        window.location.search = '';
      } else {
        window.location.search = '?mode=best';
      }
      break;
    }
    case 'KeyD': {
      event.preventDefault();
      const active = document.querySelector('.pagination .active');
      if (active.previousElementSibling) {
        active.previousElementSibling.firstChild.click();
      }
      break;
    }
    case 'KeyF': {
      event.preventDefault();
      const active = document.querySelector('.pagination .active');
      if (active.nextElementSibling) {
        active.nextElementSibling.firstChild.click();
      }
      break;
    }
    default:
      break;
  }
}
