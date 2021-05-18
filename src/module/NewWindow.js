import { ARTICLE_LOADED, BOARD_LOADED } from '../core/ArcaSelector';
import { addAREventListener } from '../core/AREventHandler';
import { addSetting, getValue, setValue } from '../core/Configure';
import { waitForElement } from '../core/LoadManager';

export default { load };

const OPEN_ARTICLE = { key: 'openNewWindow', defaultValue: false };
const BLOCK_MEDIA = { key: 'blockImageNewWindow', defaultValue: false };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(BOARD_LOADED)) {
      applyOpenNewWindow();
    }

    if (await waitForElement(ARTICLE_LOADED)) {
      applyBlockNewWindow();
    }

    addAREventListener('ArticleChange', {
      priority: 100,
      callback: applyOpenNewWindow,
    });
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const openArticle = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  const blockMedia = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  addSetting({
    header: '창 열기',
    group: [
      {
        title: '게시물 클릭 시 새 창으로 열기',
        content: openArticle,
      },
      {
        title: '이미지, 비디오 클릭 시 새 창으로 열기 방지',
        content: blockMedia,
      },
    ],
    valueCallback: {
      save() {
        setValue(OPEN_ARTICLE, openArticle.value === 'true');
        setValue(BLOCK_MEDIA, blockMedia.value === 'true');
      },
      load() {
        openArticle.value = getValue(OPEN_ARTICLE);
        blockMedia.value = getValue(BLOCK_MEDIA);
      },
    },
  });
}

function applyOpenNewWindow() {
  const value = getValue(OPEN_ARTICLE);
  if (!value) return;

  const articles = document.querySelectorAll('a.vrow:not(.notice-unfilter)');

  for (const article of articles) {
    article.setAttribute('target', '_blank');
  }
}

function applyBlockNewWindow() {
  if (!getValue(BLOCK_MEDIA)) return;

  const targetElements = document.querySelectorAll(
    '.article-body img, .article-body video:not([controls])'
  );

  for (const element of targetElements) {
    const a = <a />;

    element.insertAdjacentElement('beforebegin', a);
    a.append(element);
  }
}
