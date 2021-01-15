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
  addSetting({
    category: 'INTERFACE',
    header: '최근 방문 채널 숨김',
    view: hideRecentVisit,
    description: '',
    valueCallback: {
      save() {
        setValue(HIDE_RECENT_VISIT, hideRecentVisit.value === 'true');
      },
      load() {
        hideRecentVisit.value = getValue(HIDE_RECENT_VISIT);
      },
    },
  });

  const hideSideMenu = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  addSetting({
    category: 'INTERFACE',
    header: '우측 사이드 메뉴 숨김',
    view: hideSideMenu,
    description: '',
    valueCallback: {
      save() {
        setValue(HIDE_SIDEMENU, hideSideMenu.value === 'true');
      },
      load() {
        hideSideMenu.value = getValue(HIDE_SIDEMENU);
      },
    },
  });

  const hideAvatar = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  addSetting({
    category: 'INTERFACE',
    header: '프로필 아바타 숨김',
    view: hideAvatar,
    description: '',
    valueCallback: {
      save() {
        setValue(HIDE_AVATAR, hideAvatar.value === 'true');
      },
      load() {
        hideAvatar.value = getValue(HIDE_AVATAR);
      },
    },
  });

  const hideModified = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  addSetting({
    category: 'INTERFACE',
    header: '댓글 *수정됨 숨김',
    view: hideModified,
    description: '',
    valueCallback: {
      save() {
        setValue(HIDE_MODIFIED, hideModified.value === 'true');
      },
      load() {
        hideModified.value = getValue(HIDE_MODIFIED);
      },
    },
  });

  const resizeMedia = <input type="text" name="resizeMedia" />;
  addSetting({
    category: 'INTERFACE',
    header: '본문 이미지, 동영상 사이즈',
    view: resizeMedia,
    description: '',
    valueCallback: {
      save() {
        setValue(RESIZE_MEDIA, resizeMedia.value);
      },
      load() {
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
