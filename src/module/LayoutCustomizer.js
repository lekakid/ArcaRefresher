import { COMMENT_LOADED, HEADER_LOADED } from '../core/ArcaSelector';
import { addSetting, getValue, setValue } from '../core/Configure';
import { waitForElement } from '../core/LoadManager';

import sheetLiveModifier from '../css/LayoutCustomizer.css';
import { getRandomColor } from '../util/ColorManager';

export default { load };

// ---------------------------------- 사이트 레이아웃 ----------------------------------
const HIDE_RECENT_VISIT = { key: 'hideRecentVisit', defaultValue: false };
const HIDE_SIDEMENU = { key: 'hideSideMenu', defaultValue: false };
const HIDE_AVATAR = { key: 'hideAvatar', defaultValue: false };
const NOTIFY_COLOR = { key: 'notificationIconColor', defaultValue: '' };
// ----------------------------------- 본문 레이아웃 -----------------------------------
const RESIZE_IMAGE = { key: 'resizeImage', defaultValue: '100' };
const RESIZE_VIDEO = { key: 'resizeVideo', defaultValue: '100' };
// ----------------------------------- 댓글 레이아웃 -----------------------------------
const HIDE_COMMENT = { key: 'hideComment', defaultValue: false };
const HIDE_MODIFIED = { key: 'hideModified', defaultValue: false };
const WIDE_AREA = { key: 'wideCommentArea', defaultValue: true };
const FORCE_OPEN_COMMENT = { key: 'forceOpenComment', defaultValue: false };

async function load() {
  try {
    setupSetting();

    await waitForElement('head');
    applyStyle();

    await waitForElement(HEADER_LOADED);
    onLoadSite();

    if (await waitForElement(COMMENT_LOADED)) {
      onLoadArticle();
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  // ---------------------------------- 사이트 레이아웃 ----------------------------------
  const hideRecentVisit = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  const hideSideMenu = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  const hideAvatar = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  const notifyColor = <input type="text" placeholder="FFC107" maxLength="6" />;
  const notificationIcon = (
    <span
      className="ion-android-notifications"
      style={{
        padding: '0.3rem',
        fontSize: '1.25rem',
        textAlign: 'center',
        border: '1px solid #3d414d',
        backgroundColor: '#3d414d',
        color: '#fff',
      }}
    />
  );

  // 이벤트 핸들러
  notifyColor.addEventListener('keypress', (event) => {
    const regex = /[0-9a-fA-F]/;
    if (!regex.test(event.key)) event.preventDefault();
  });
  notifyColor.addEventListener('dblclick', (event) => {
    const color = getRandomColor();

    event.target.value = color;
    notificationIcon.style.color = `#${color}`;
  });
  notifyColor.addEventListener('input', (event) => {
    let color = '';

    if (event.target.value.length === 6) {
      color = `#${event.target.value}`;
    } else {
      color = '#fff';
    }

    notificationIcon.style.color = color;
  });

  addSetting({
    header: '사이트 레이아웃',
    group: [
      {
        title: '최근 방문 채널 숨김',
        content: hideRecentVisit,
      },
      {
        title: '우측 사이드 메뉴 숨김',
        content: hideSideMenu,
      },
      {
        title: '프로필 아바타 숨김',
        content: hideAvatar,
      },
      {
        title: '알림 아이콘 점등 색상 변경',
        description: (
          <>
            색상을 입력하면 알림 아이콘에서 미리 볼 수 있습니다.
            <br />
            더블 클릭으로 무작위 색상을 선택할 수 있습니다.
          </>
        ),
        content: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {notifyColor}
            {notificationIcon}
          </div>
        ),
      },
    ],
    valueCallback: {
      save() {
        setValue(HIDE_RECENT_VISIT, hideRecentVisit.value === 'true');
        setValue(HIDE_SIDEMENU, hideSideMenu.value === 'true');
        setValue(HIDE_AVATAR, hideAvatar.value === 'true');
        setValue(NOTIFY_COLOR, notifyColor.value);
      },
      load() {
        hideRecentVisit.value = getValue(HIDE_RECENT_VISIT);
        hideSideMenu.value = getValue(HIDE_SIDEMENU);
        hideAvatar.value = getValue(HIDE_AVATAR);
        notifyColor.value = getValue(NOTIFY_COLOR);

        notificationIcon.style.color = '#fff';
      },
    },
  });

  // ----------------------------------- 본문 레이아웃 -----------------------------------
  const resizeImage = <input type="text" />;
  const resizeVideo = <input type="text" />;

  addSetting({
    header: '게시물 레이아웃',
    group: [
      {
        title: '이미지 사이즈',
        content: resizeImage,
      },
      {
        title: '동영상 사이즈',
        content: resizeVideo,
      },
    ],
    valueCallback: {
      save() {
        setValue(RESIZE_IMAGE, resizeImage.value);
        setValue(RESIZE_VIDEO, resizeVideo.value);
      },
      load() {
        resizeImage.value = getValue(RESIZE_IMAGE);
        resizeVideo.value = getValue(RESIZE_VIDEO);
      },
    },
  });

  // ----------------------------------- 댓글 레이아웃 -----------------------------------
  const hideComment = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  const hideModified = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  const wideCommentArea = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  const forceOpenComment = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );

  addSetting({
    header: '댓글 레이아웃',
    group: [
      {
        title: '댓글창 접어두기',
        content: hideComment,
      },
      {
        title: '*수정됨 숨김',
        content: hideModified,
      },
      {
        title: '클릭하면 답글창이 바로 열리게 하기',
        content: wideCommentArea,
      },
      {
        title: '접힌 댓글 바로 펼쳐보기',
        content: forceOpenComment,
      },
    ],
    valueCallback: {
      save() {
        setValue(HIDE_COMMENT, hideComment.value === 'true');
        setValue(HIDE_MODIFIED, hideModified.value === 'true');
        setValue(WIDE_AREA, wideCommentArea.value === 'true');
        setValue(FORCE_OPEN_COMMENT, forceOpenComment.value === 'true');
      },
      load() {
        hideComment.value = getValue(HIDE_COMMENT);
        hideModified.value = getValue(HIDE_MODIFIED);
        forceOpenComment.value = getValue(FORCE_OPEN_COMMENT);
        wideCommentArea.value = getValue(WIDE_AREA);
      },
    },
  });
}

function onLoadSite() {
  const contentWrapper = document.querySelector('.content-wrapper');

  // ---------------------------------- 사이트 레이아웃 ----------------------------------

  const hideRecentVisit = getValue(HIDE_RECENT_VISIT);
  if (hideRecentVisit) contentWrapper.classList.add('hide-recent-visit');

  const hideSideMenu = getValue(HIDE_SIDEMENU);
  if (hideSideMenu) contentWrapper.classList.add('hide-sidemenu');

  const hideAvatar = getValue(HIDE_AVATAR);
  if (hideAvatar) contentWrapper.classList.add('hide-avatar');

  const color = getValue(NOTIFY_COLOR);
  const notificationIcon = document.querySelector('.navbar-wrapper .noti-menu-link span');
  if (notificationIcon) {
    const notiObserver = new MutationObserver(() => {
      if (notificationIcon.style.color) {
        notificationIcon.style.color = `#${color}`;
      }
    });
    notiObserver.observe(notificationIcon, { attributes: true });
  }
}

function onLoadArticle() {
  const contentWrapper = document.querySelector('.content-wrapper');

  // ----------------------------------- 본문 레이아웃 -----------------------------------

  const resizeImage = getValue(RESIZE_IMAGE);
  const imageCSS = `.article-body  img, .article-body video:not([controls]) {
        max-width: ${resizeImage}% !important;
    }`;
  document.head.append(<style>{imageCSS}</style>);

  const resizeVideo = getValue(RESIZE_VIDEO);
  const videoCSS = `.article-body video[controls] {
        max-width: ${resizeVideo}% !important;
    }`;
  document.head.append(<style>{videoCSS}</style>);

  // ----------------------------------- 댓글 레이아웃 -----------------------------------

  const hideModified = getValue(HIDE_MODIFIED);
  if (hideModified) contentWrapper.classList.add('hide-modified');

  const forceOpenComment = getValue(FORCE_OPEN_COMMENT);
  if (forceOpenComment) {
    contentWrapper.classList.add('force-open-comment');
  }

  const hideComment = getValue(HIDE_COMMENT);
  if (hideComment) {
    const comment = document.querySelector('#comment');
    const showCommentBtn = (
      <button className="btn btn-arca" style={{ width: '100%', margin: '0.5rem 0' }}>
        댓글 보이기
      </button>
    );
    showCommentBtn.addEventListener('click', (e) => {
      e.target.classList.add('hidden');
      comment.classList.remove('hidden');
    });
    comment.insertAdjacentElement('beforebegin', showCommentBtn);
    comment.classList.add('hidden');
  }

  const wideCommentArea = getValue(WIDE_AREA);
  if (wideCommentArea) {
    const commentArea = document.querySelector('#comment');
    commentArea.addEventListener('click', (event) => {
      if (event.target.closest('form')) return;

      const element = event.target.closest('a, .emoticon, .btn-more, .message');
      if (element == null) return;
      if (!element.classList.contains('message')) return;

      event.preventDefault();

      element.parentNode.querySelector('.reply-link').click();
    });
  }
}

async function applyStyle() {
  document.head.append(<style>{sheetLiveModifier}</style>);
}
