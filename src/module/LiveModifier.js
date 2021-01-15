import Configure from '../core/Configure';

import sheetLiveModifier from '../css/LiveModifier.css';

export default { load };

const HIDE_RECENT_VISIT = { key: 'hideRecentVisit', defaultValue: false };
const HIDE_SIDEMENU = { key: 'hideSideMenu', defaultValue: false };
const HIDE_AVATAR = { key: 'hideAvatar', defaultValue: false };
const HIDE_MODIFIED = { key: 'hideModified', defaultValue: false };
const RESIZE_MEDIA = { key: 'resizeMedia', defaultValue: '100' };

function load() {
  try {
    addSetting();

    apply();
  } catch (error) {
    console.error(error);
  }
}

function addSetting() {
  const hideRecentVisit = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '최근 방문 채널 숨김',
    option: hideRecentVisit,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_RECENT_VISIT, hideRecentVisit.value === 'true');
      },
      load() {
        hideRecentVisit.value = Configure.get(HIDE_RECENT_VISIT);
      },
    },
  });

  const hideSideMenu = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '우측 사이드 메뉴 숨김',
    option: hideSideMenu,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_SIDEMENU, hideSideMenu.value === 'true');
      },
      load() {
        hideSideMenu.value = Configure.get(HIDE_SIDEMENU);
      },
    },
  });

  const hideAvatar = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '프로필 아바타 숨김',
    option: hideAvatar,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_AVATAR, hideAvatar.value === 'true');
      },
      load() {
        hideAvatar.value = Configure.get(HIDE_AVATAR);
      },
    },
  });

  const hideModified = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '댓글 *수정됨 숨김',
    option: hideModified,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_MODIFIED, hideModified.value === 'true');
      },
      load() {
        hideModified.value = Configure.get(HIDE_MODIFIED);
      },
    },
  });

  const resizeMedia = <input type="text" name="resizeMedia" />;
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '본문 이미지, 동영상 사이즈',
    option: resizeMedia,
    description: '',
    callback: {
      save() {
        Configure.set(RESIZE_MEDIA, resizeMedia.value);
      },
      load() {
        resizeMedia.value = Configure.get(RESIZE_MEDIA);
      },
    },
  });
}

function apply() {
  document.head.append(<style>{sheetLiveModifier}</style>);
  const contentWrapper = document.querySelector('.content-wrapper');

  const hideRecentVisit = Configure.get(HIDE_RECENT_VISIT);
  if (hideRecentVisit) contentWrapper.classList.add('hide-recent-visit');

  const hideSideMenu = Configure.get(HIDE_SIDEMENU);
  if (hideSideMenu) contentWrapper.classList.add('hide-sidemenu');

  const hideAvatar = Configure.get(HIDE_AVATAR);
  if (hideAvatar) contentWrapper.classList.add('hide-avatar');

  const hideModified = Configure.get(HIDE_MODIFIED);
  if (hideModified) contentWrapper.classList.add('hide-modified');

  const resizeMedia = Configure.get(RESIZE_MEDIA);
  const css = `.article-body img, .article-body video {
        max-width: ${resizeMedia}% !important;
    }`;

  document.head.append(<style>{css}</style>);
}
