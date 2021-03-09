import { addSetting, getValue, setValue } from '../core/Configure';

import sheetLiveModifier from '../css/LayoutCustomizer.css';
import { getRandomColor } from '../util/ColorManager';

export default { load };

const HIDE_RECENT_VISIT = { key: 'hideRecentVisit', defaultValue: false };
const HIDE_SIDEMENU = { key: 'hideSideMenu', defaultValue: false };
const HIDE_AVATAR = { key: 'hideAvatar', defaultValue: false };
const HIDE_MODIFIED = { key: 'hideModified', defaultValue: false };
const RESIZE_IMAGE = { key: 'resizeImage', defaultValue: '100' };
const RESIZE_VIDEO = { key: 'resizeVideo', defaultValue: '100' };
const NOTIFY_COLOR = { key: 'notificationIconColor', defaultValue: '' };

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

  const resizeImage = <input type="text" />;
  const resizeVideo = <input type="text" />;

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
        title: '본문 이미지 사이즈',
        content: resizeImage,
      },
      {
        title: '본문 동영상 사이즈',
        content: resizeVideo,
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
        setValue(HIDE_MODIFIED, hideModified.value === 'true');
        setValue(RESIZE_IMAGE, resizeImage.value);
        setValue(RESIZE_VIDEO, resizeVideo.value);
        setValue(NOTIFY_COLOR, notifyColor.value);
      },
      load() {
        hideRecentVisit.value = getValue(HIDE_RECENT_VISIT);
        hideSideMenu.value = getValue(HIDE_SIDEMENU);
        hideAvatar.value = getValue(HIDE_AVATAR);
        hideModified.value = getValue(HIDE_MODIFIED);
        resizeImage.value = getValue(RESIZE_IMAGE);
        resizeVideo.value = getValue(RESIZE_VIDEO);
        notifyColor.value = getValue(NOTIFY_COLOR);

        notificationIcon.style.color = '#fff';
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

  const color = getValue(NOTIFY_COLOR);

  const notificationIcon = document.querySelector('.navbar-wrapper .noti-menu-link span');
  if (notificationIcon === null) return;

  const notiObserver = new MutationObserver(() => {
    if (notificationIcon.style.color) {
      notificationIcon.style.color = `#${color}`;
    }
  });
  notiObserver.observe(notificationIcon, { attributes: true });
}
