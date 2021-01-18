import { addSetting, getValue, setValue } from '../core/Configure';

import sheetLiveModifier from '../css/LiveModifier.css';

export default { load };

const HIDE_RECENT_VISIT = { key: 'hideRecentVisit', defaultValue: false };
const HIDE_SIDEMENU = { key: 'hideSideMenu', defaultValue: false };
const HIDE_AVATAR = { key: 'hideAvatar', defaultValue: false };
const HIDE_MODIFIED = { key: 'hideModified', defaultValue: false };
const RESIZE_MEDIA = { key: 'resizeMedia', defaultValue: '100' };

function load() {
  try {
    setupSetting();

    apply();
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
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
  const hideModified = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  const resizeMedia = <input type="text" name="resizeMedia" />;
  addSetting({
    header: '레이아웃 커스텀',
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
        title: '댓글 *수정됨 숨김',
        content: hideModified,
      },
      {
        title: '본문 이미지, 동영상 사이즈',
        content: resizeMedia,
      },
    ],
    valueCallback: {
      save() {
        setValue(HIDE_RECENT_VISIT, hideRecentVisit.value === 'true');
        setValue(HIDE_SIDEMENU, hideSideMenu.value === 'true');
        setValue(HIDE_AVATAR, hideAvatar.value === 'true');
        setValue(HIDE_MODIFIED, hideModified.value === 'true');
        setValue(RESIZE_MEDIA, resizeMedia.value);
      },
      load() {
        hideRecentVisit.value = getValue(HIDE_RECENT_VISIT);
        hideSideMenu.value = getValue(HIDE_SIDEMENU);
        hideAvatar.value = getValue(HIDE_AVATAR);
        hideModified.value = getValue(HIDE_MODIFIED);
        resizeMedia.value = getValue(RESIZE_MEDIA);
      },
    },
  });
}

function apply() {
  document.head.append(<style>{sheetLiveModifier}</style>);
  const contentWrapper = document.querySelector('.content-wrapper');

  const hideRecentVisit = getValue(HIDE_RECENT_VISIT);
  if (hideRecentVisit) contentWrapper.classList.add('hide-recent-visit');

  const hideSideMenu = getValue(HIDE_SIDEMENU);
  if (hideSideMenu) contentWrapper.classList.add('hide-sidemenu');

  const hideAvatar = getValue(HIDE_AVATAR);
  if (hideAvatar) contentWrapper.classList.add('hide-avatar');

  const hideModified = getValue(HIDE_MODIFIED);
  if (hideModified) contentWrapper.classList.add('hide-modified');

  const resizeMedia = getValue(RESIZE_MEDIA);
  const css = `.article-body img, .article-body video {
        max-width: ${resizeMedia}% !important;
    }`;

  document.head.append(<style>{css}</style>);
}
