import ArticleMenu from '../core/ArticleMenu';
import { addAREventListener } from '../core/AREventHandler';
import { addSetting, getValue, setValue } from '../core/Configure';
import { parseChannelID, parseUserID, parseUserInfo } from '../core/Parser';

import MuteStyle, { stylesheet } from '../css/MuteContent.module.css';
import { waitForElement } from '../core/LoadManager';
import { ARTICLE_LOADED, BOARD_LOADED, BOARD_VIEW, BOARD_CATEGORIES } from '../core/ArcaSelector';

export default { load };

const BLOCK_USER = { key: 'blockUser', defaultValue: [] };
const BLOCK_KEYWORD = { key: 'blockKeyword', defaultValue: [] };
const MUTE_CATEGORY = { key: 'muteCategory', defaultValue: {} };
const MUTE_NOTICE = { key: 'hideNotice', defaultValue: false };
const MUTE_REPLY_TYPE = { key: 'muteReplyType', defaultValue: 'target-only' };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(ARTICLE_LOADED)) {
      addArticleMenu();
    }
    if (await waitForElement(BOARD_LOADED)) {
      muteSidebar();
      muteComment();
      muteNotice();
      mutePreview();
      muteArticle();
    }

    addAREventListener('ArticleChange', {
      priority: 100,
      callback() {
        muteNotice();
        mutePreview();
        muteArticle();
      },
    });
    addAREventListener('CommentChange', {
      priority: 100,
      callback() {
        muteComment();
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const hideNotice = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  const muteReplyType = (
    <select>
      <option value="target-only">뮤트 대상만</option>
      <option value="contain-child">답글을 포함</option>
    </select>
  );
  const userMute = (
    <textarea rows="6" placeholder="뮤트할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />
  );
  const keywordMute = (
    <textarea rows="6" placeholder="뮤트할 키워드를 입력, 줄바꿈으로 구별합니다." />
  );
  const category = [...document.querySelectorAll(BOARD_CATEGORIES)];
  const categoryContainer = {};
  const categoryWrapper = (
    <div className={MuteStyle.wrapper}>
      <style>{stylesheet}</style>
      {category.map((c) => {
        let name = c.textContent;
        if (name === '전체') name = '일반';

        const previewInput = <input type="checkbox" style={{ margin: '0.25rem' }} />;
        const articleInput = <input type="checkbox" style={{ margin: '0.25rem' }} />;

        categoryContainer[name] = {
          previewMute: previewInput,
          articleMute: articleInput,
        };

        return (
          <div className={MuteStyle.item}>
            <div>{name}</div>
            <div>
              <label>{previewInput}미리보기 뮤트</label>
              <label>{articleInput}게시물 뮤트</label>
            </div>
          </div>
        );
      })}
    </div>
  );

  const channel = window.location.pathname.split('/')[2];

  addSetting({
    header: '뮤트',
    group: [
      {
        title: '공지사항 접기',
        content: hideNotice,
      },
      {
        title: '댓글을 숨길 때',
        content: muteReplyType,
      },
      {
        title: '사용자 목록',
        description: (
          <>
            지정한 유저의 게시물과 댓글을 숨깁니다.
            <br />
            Regex 문법을 지원하기 때문에 특수문자 사용 시 역슬래시를 붙여야합니다.
            <br />
            사용 시 역슬래시를 붙여 작성해야하는 특수문자 목록
            <br />
            <ul>
              <li>소괄호()</li>
              <li>마침표.</li>
            </ul>
          </>
        ),
        content: userMute,
        type: 'wide',
      },
      {
        title: '키워드 목록',
        description: (
          <>
            지정한 키워드가 포함된 제목을 가진 게시물과 댓글을 숨깁니다.
            <br />
            Regex 문법을 지원하기 때문에 특수문자 사용 시 역슬래시를 붙여야합니다.
            <br />
            사용 시 역슬래시를 붙여 작성해야하는 특수문자 목록
            <br />
            <ul>
              <li>소괄호()</li>
              <li>중괄호{'{}'}</li>
              <li>대괄호[]</li>
              <li>마침표.</li>
              <li>플러스+</li>
              <li>물음표?</li>
              <li>달러기호$</li>
              <li>캐럿^</li>
              <li>별*</li>
              <li>슬래시/</li>
              <li>역슬래시\</li>
              <li>하이픈-</li>
              <li>파이프|</li>
            </ul>
          </>
        ),
        content: keywordMute,
        type: 'wide',
      },
      {
        title: '카테고리 설정',
        description: (
          <>
            미리보기 뮤트: 해당 카테고리 게시물의 미리보기를 제거합니다.
            <br />
            게시물 뮤트: 해당 카테고리의 게시물을 숨깁니다.
          </>
        ),
        content: categoryWrapper,
        type: 'wide',
      },
    ],
    configHandler: {
      save() {
        setValue(MUTE_NOTICE, hideNotice.value === 'true');
        setValue(MUTE_REPLY_TYPE, muteReplyType.value);
        setValue(
          BLOCK_USER,
          userMute.value.split('\n').filter((i) => i !== '')
        );
        setValue(
          BLOCK_KEYWORD,
          keywordMute.value.split('\n').filter((i) => i !== '')
        );

        const config = getValue(MUTE_CATEGORY);
        let channelConfig = config[channel];
        if (!channelConfig) channelConfig = {};

        const defaultConfig = {
          mutePreview: false,
          muteArticle: false,
        };

        for (const key in categoryContainer) {
          if (categoryContainer[key]) {
            const row = categoryContainer[key];
            const preview = row.previewMute.checked;
            const article = row.articleMute.checked;

            channelConfig[key] = {
              mutePreview: preview,
              muteArticle: article,
            };

            if (JSON.stringify(channelConfig) === JSON.stringify(defaultConfig)) {
              delete channelConfig[key];
            }
          }
        }

        setValue(MUTE_CATEGORY, { ...config, [channel]: channelConfig });
      },
      load() {
        hideNotice.value = getValue(MUTE_NOTICE);
        muteReplyType.value = getValue(MUTE_REPLY_TYPE);
        userMute.value = getValue(BLOCK_USER).join('\n');
        keywordMute.value = getValue(BLOCK_KEYWORD).join('\n');

        const config = getValue(MUTE_CATEGORY)[channel];
        if (!config) return;

        for (const key in categoryContainer) {
          if (config[key]) {
            const { mutePreview: preview, muteArticle: article } = config[key];
            categoryContainer[key].previewMute.checked = preview;
            categoryContainer[key].articleMute.checked = article;
          }
        }
      },
    },
  });
}

const AUTHOR_INFO = '.article-head .user-info';
function addArticleMenu() {
  const userInfo = document.querySelector(AUTHOR_INFO);
  if (!userInfo) return;

  const userList = getValue(BLOCK_USER);
  const user = parseUserInfo(userInfo);
  const userID = parseUserID(userInfo).replace(')', '\\)').replace('.', '\\.');
  const filter = `${user === userID ? '^' : ''}${userID}$`;
  const indexed = userList.indexOf(filter);

  if (indexed > -1) {
    ArticleMenu.addHeaderBtn({
      text: '뮤트 해제',
      icon: 'ion-ios-refresh-empty',
      description: '게시물 작성자의 뮤트를 해제합니다.',
      onClick(event) {
        event.preventDefault();

        userList.splice(indexed, 1);
        setValue(BLOCK_USER, userList);
        window.location.reload();
      },
    });
  } else {
    ArticleMenu.addHeaderBtn({
      text: '뮤트',
      icon: 'ion-ios-close',
      description: '게시물 작성자를 뮤트합니다.',
      onClick(event) {
        event.preventDefault();

        userList.push(filter);
        setValue(BLOCK_USER, userList);
        window.history.back();
      },
    });
  }
}

function mutePreview() {
  const channel = parseChannelID();
  const config = getValue(MUTE_CATEGORY)[channel];
  if (!config) return;

  const articles = document.querySelectorAll('a.vrow:not(.notice)');
  articles.forEach((article) => {
    const badge = article.querySelector('.badge');
    if (badge === null) return;

    let category = badge.textContent;
    category = category === '' ? '일반' : category;
    if (!config[category]) return;

    const { mutePreview: filtered } = config[category];
    if (!filtered) return;

    const preview = article.querySelector('.vrow-preview');
    if (preview) preview.remove();
  });
}

function muteNotice() {
  if (!getValue(MUTE_NOTICE)) return;

  if (document.readyState !== 'complete') {
    window.addEventListener(
      'load',
      () => {
        muteNotice();
      },
      { once: true }
    );
    return;
  }

  const itemContainer = document.querySelector(
    'div.board-article-list .list-table, div.included-article-list .list-table'
  );
  if (!itemContainer) return;
  const notices = itemContainer.querySelectorAll('a.vrow.notice-board');
  let noticeCount = 0;
  for (const notice of notices) {
    if (notice !== notices[notices.length - 1]) {
      notice.classList.add('filtered');
      notice.classList.add('filtered-notice');
      noticeCount += 1;
    } else {
      let unfilterBtn = itemContainer.querySelector('.notice-unfilter');
      if (!unfilterBtn) {
        // 사용자가 공식 공지 숨기기 기능을 사용하지 않음
        unfilterBtn = (
          <a className="vrow notice notice-unfilter">
            <div className="vrow-top">
              숨겨진 공지 펼치기(
              <span className="notice-filter-count">{noticeCount}</span>개){' '}
              <span className="ion-android-archive" />
            </div>
          </a>
        );
        unfilterBtn.addEventListener('click', () => {
          itemContainer.classList.add('show-filtered-notice');
          unfilterBtn.style.display = 'none';
        });
        notice.insertAdjacentElement('afterend', unfilterBtn);
      }
    }
  }
}

const ContentTypeString = {
  keyword: '키워드',
  user: '사용자',
  category: '카테고리',
  deleted: '삭제됨',
  all: '전체',
};

const ArticleHeader = { element: null };
function muteArticle() {
  if (document.readyState !== 'complete') {
    window.addEventListener('load', muteArticle, { once: true });
    return;
  }

  const container = document.querySelector(BOARD_VIEW);
  if (!container) return;

  const items = container.querySelectorAll('a.vrow:not(.notice)');
  const count = mapFilter(
    [...items].map((e) => {
      const userElement = e.querySelector('.user-info');
      const keywordElement = e.querySelector('.title');
      const categoryElement = e.querySelector('.badge');
      return {
        element: e,
        user: userElement ? parseUserInfo(userElement) : '',
        content: keywordElement ? keywordElement.textContent : '',
        category: categoryElement ? categoryElement.textContent || '일반' : '',
      };
    })
  );

  if (!ArticleHeader.element) {
    ArticleHeader.element = container.querySelector('.frontend-header');
    if (ArticleHeader.element) ArticleHeader.element.remove();
    ArticleHeader.element = (
      <div className={`frontend-header ${count.all === 0 ? 'hidden' : ''}`}>
        <span className="filter-title">필터된 게시물</span>
        <span className="filter-count-container">
          {Object.keys(count).map((key) => {
            const onClick = () => {
              const className = `show-filtered${key === 'all' ? '' : `-${key}`}`;
              if (container.classList.contains(className)) {
                container.classList.remove(className);
              } else {
                container.classList.add(className);
              }
            };
            ArticleHeader[key] = (
              <span
                className={`filter-count 
                  filter-count${key === 'all' ? '' : `-${key}`} 
                  ${count[key] === 0 ? 'hidden' : ''}`}
                onClick={onClick}
              >
                {ContentTypeString[key]} ({count[key]})
              </span>
            );
            return ArticleHeader[key];
          })}
        </span>
      </div>
    );
    container.insertAdjacentElement('afterbegin', ArticleHeader.element);
    return;
  }

  if (count.all === 0) {
    ArticleHeader.element.classList.add('hidden');
    return;
  }
  ArticleHeader.element.classList.remove('hidden');
  Object.keys(count).forEach((key) => {
    if (count[key] === 0) {
      ArticleHeader[key].classList.add('hidden');
      return;
    }

    ArticleHeader[key].classList.remove('hidden');
    ArticleHeader[key].textContent = `${ContentTypeString[key]} (${count[key]})`;
  });
}

const CommentHeader = { element: null };
function muteComment() {
  if (document.readyState !== 'complete') {
    window.addEventListener('load', muteComment, { once: true });
    return;
  }

  const muteType = getValue(MUTE_REPLY_TYPE);

  const container = document.querySelector('#comment .list-area');
  if (!container) return;
  const items = container.querySelectorAll(
    muteType === 'target-only' ? '.comment-item' : '.comment-wrapper'
  );
  const count = mapFilter(
    [...items].map((e) => {
      const userElement = e.querySelector('.user-info');
      const keywordElement = e.querySelector('.message');
      return {
        element: e,
        user: parseUserInfo(userElement),
        content: keywordElement.textContent,
        category: '',
      };
    })
  );

  if (!CommentHeader.element) {
    CommentHeader.element = container.previousElementSibling;
    if (CommentHeader.element.classList.contains('frontend-header')) CommentHeader.element.remove();
    CommentHeader.element = (
      <div className={`frontend-header ${count.all === 0 ? 'hidden' : ''}`}>
        <span className="filter-title">필터된 댓글</span>
        <span className="filter-count-container">
          {Object.keys(count).map((key) => {
            const onClick = () => {
              const className = `show-filtered${key === 'all' ? '' : `-${key}`}`;
              if (container.classList.contains(className)) {
                container.classList.remove(className);
              } else {
                container.classList.add(className);
              }
            };
            CommentHeader[key] = (
              <span
                className={`filter-count 
                filter-count${key === 'all' ? '' : `-${key}`} 
                ${count[key] === 0 ? 'hidden' : ''}`}
                onClick={onClick}
              >
                {ContentTypeString[key]} ({count[key]})
              </span>
            );
            return CommentHeader[key];
          })}
        </span>
      </div>
    );
    container.insertAdjacentElement('beforebegin', CommentHeader.element);
    return;
  }

  container.insertAdjacentElement('beforebegin', CommentHeader.element);
  if (count.all === 0) {
    CommentHeader.element.classList.add('hidden');
    return;
  }
  CommentHeader.element.classList.remove('hidden');
  Object.keys(count).forEach((key) => {
    if (count[key] === 0) {
      CommentHeader[key].classList.add('hidden');
      return;
    }

    CommentHeader[key].classList.remove('hidden');
    CommentHeader[key].textContent = `${ContentTypeString[key]} (${count[key]})`;
  });
}

function mapFilter(items) {
  const count = {};
  for (const key of Object.keys(ContentTypeString)) {
    count[key] = 0;
  }

  const channel = parseChannelID();
  const { users, keywords } = unsafeWindow.LiveConfig.mute || { users: [], keywords: [] };
  const userlist = Array.from(new Set([...users, ...getValue(BLOCK_USER)]));
  const keywordlist = Array.from(new Set([...keywords, ...getValue(BLOCK_KEYWORD)]));
  const categoryConfig = getValue(MUTE_CATEGORY)[channel] || {};

  items.forEach(({ element, user, content, category }) => {
    if (userlist.length && new RegExp(userlist.join('|')).test(user)) {
      element.classList.add('filtered');
      element.classList.add('filtered-user');
      count.user += 1;
      count.all += 1;
    }

    if (keywordlist.length && new RegExp(keywordlist.join('|')).test(content)) {
      element.classList.add('filtered');
      element.classList.add('filtered-keyword');
      count.keyword += 1;
      count.all += 1;
    }

    const { muteArticle: muteCategory } = categoryConfig[category] || { muteArticle: false };
    if (muteCategory) {
      element.classList.add('filtered');
      element.classList.add('filtered-category');
      count.category += 1;
      count.all += 1;
    }

    if (element.classList.contains('deleted')) {
      element.classList.add('filtered');
      element.classList.add('filtered-deleted');
      count.deleted += 1;
      count.all += 1;
    }
  });

  return count;
}

function muteSidebar() {
  let keywordlist = getValue(BLOCK_KEYWORD);

  if ((unsafeWindow.LiveConfig || undefined) && unsafeWindow.LiveConfig.mute !== undefined) {
    keywordlist.push(...unsafeWindow.LiveConfig.mute.keywords);
    keywordlist = Array.from(new Set(keywordlist));
  }

  if (keywordlist.length === 0) return;

  const contents = document.querySelectorAll(
    '#recentLive .link-list a, #recentChannelHeadline .link-list a'
  );
  contents.forEach((e) => {
    if (new RegExp(keywordlist.join('|')).test(e.textContent)) {
      e.replaceWith(<span>키워드 뮤트 됨</span>);
    }
  });
}
