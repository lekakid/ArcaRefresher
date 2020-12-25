import Configure from '../core/Configure';

import sheetLiveModifier from '../css/LiveModifier.css';

export default { addSetting, apply };

const FIX_HEADER = 'fixHeader';
const HIDE_RECENT_VISIT = 'hideRecentVisit';
const HIDE_SIDEMENU = 'hideSideMenu';
const HIDE_AVATAR = 'hideAvatar';
const HIDE_MODIFIED = 'hideModified';
const RESIZE_MEDIA = 'resizeMedia';

function addSetting() {
    const fixHeader = (
        <select>
            <option value="false">고정 안 함</option>
            <option value="true">고정</option>
        </select>
    );
    Configure.addSetting({
        category: Configure.categoryKey.INTERFACE,
        header: '상단 헤더 고정',
        option: fixHeader,
        description: '',
        callback: {
            save() {
                GM_setValue(FIX_HEADER, fixHeader.value == 'true');
            },
            load() {
                fixHeader.value = GM_getValue(FIX_HEADER, true);
            },
        },
    });

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
                GM_setValue(HIDE_RECENT_VISIT, hideRecentVisit.value == 'true');
            },
            load() {
                hideRecentVisit.value = GM_getValue(HIDE_RECENT_VISIT, false);
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
                GM_setValue(HIDE_SIDEMENU, hideSideMenu.value == 'true');
            },
            load() {
                hideSideMenu.value = GM_getValue(HIDE_SIDEMENU, false);
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
                GM_setValue(HIDE_AVATAR, hideAvatar.value == 'true');
            },
            load() {
                hideAvatar.value = GM_getValue(HIDE_AVATAR, false);
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
                GM_setValue(HIDE_MODIFIED, hideModified.value == 'true');
            },
            load() {
                hideModified.value = GM_getValue(HIDE_MODIFIED, false);
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
                GM_setValue(RESIZE_MEDIA, resizeMedia.value);
            },
            load() {
                resizeMedia.value = GM_getValue(RESIZE_MEDIA, '100');
            },
        },
    });
}

function apply() {
    document.head.append(<style>{sheetLiveModifier}</style>);
    const contentWrapper = document.querySelector('.content-wrapper');

    const fixHeader = GM_getValue(FIX_HEADER, true);
    if(fixHeader) document.body.classList.add('fix-header');

    const hideRecentVisit = GM_getValue(HIDE_RECENT_VISIT, false);
    if(hideRecentVisit) contentWrapper.classList.add('hide-recent-visit');

    const hideSideMenu = GM_getValue(HIDE_SIDEMENU, false);
    if(hideSideMenu) contentWrapper.classList.add('hide-sidemenu');

    const hideAvatar = GM_getValue(HIDE_AVATAR, false);
    if(hideAvatar) contentWrapper.classList.add('hide-avatar');

    const hideModified = GM_getValue(HIDE_MODIFIED, false);
    if(hideModified) contentWrapper.classList.add('hide-modified');

    const resizeMedia = GM_getValue(RESIZE_MEDIA, '100');
    const css = `.article-body img, .article-body video {
        max-width: ${resizeMedia}% !important;
    }`;

    document.head.append(<style>{css}</style>);
}
