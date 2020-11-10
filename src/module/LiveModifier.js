import Setting from '../core/Setting';

import sheetLiveModifier from '../css/LiveModifier.css';

export default { initialize, apply };

const FIX_HEADER = 'fixHeader';
const FIX_HEADER_DEFAULT = true;
const HIDE_AVATAR = 'hideAvatar';
const HIDE_AVATAR_DEFAULT = false;
const HIDE_MODIFIED = 'hideModified';
const HIDE_MODIFIED_DEFAULT = false;
const HIDE_SIDEMENU = 'hideSideMenu';
const HIDE_SIDEMENU_DEFAULT = false;
const RESIZE_MEDIA = 'resizeMedia';
const RESIZE_MEDIA_DEFAULT = '100';

function initialize() {
    const configElement = (
        <>
            <label class="col-md-3">상단 헤더</label>
            <div class="col-md-9">
                <select name="fixHeader">
                    <option value="false">고정 안 함</option>
                    <option value="true">고정</option>
                </select>
                <p />
            </div>
            <label class="col-md-3">우측 사이드 메뉴</label>
            <div class="col-md-9">
                <select name="hideSideMenu">
                    <option value="false">보임</option>
                    <option value="true">숨김</option>
                </select>
                <p />
            </div>
            <label class="col-md-3">프로필 아바타</label>
            <div class="col-md-9">
                <select name="hideAvatar">
                    <option value="false">보임</option>
                    <option value="true">숨김</option>
                </select>
                <p />
            </div>
            <label class="col-md-3">댓글 *수정됨</label>
            <div class="col-md-9">
                <select name="hideModified">
                    <option value="false">보임</option>
                    <option value="true">숨김</option>
                </select>
                <p />
            </div>
            <label class="col-md-3">본문 이미지, 동영상 사이즈</label>
            <div class="col-md-9">
                <input type="text" name="resizeMedia" />
                <p>
                    본문 가로 길이를 기준 비율로 이미지, 동영상 크기를 조절합니다.<br />
                    0~100(%) 사이로 입력
                </p>
            </div>
        </>
    );
    const fixHeaderElement = configElement.querySelector('select[name="fixHeader"]');
    const hideSideMenuElement = configElement.querySelector('select[name="hideAvatar"]');
    const hideAvatarElement = configElement.querySelector('select[name="hideModified"]');
    const hideModifiedElement = configElement.querySelector('select[name="hideSideMenu"]');
    const resizeMediaElement = configElement.querySelector('input');

    function load() {
        const fixHeader = GM_getValue(FIX_HEADER, FIX_HEADER_DEFAULT);
        const hideAvatar = GM_getValue(HIDE_AVATAR, HIDE_AVATAR_DEFAULT);
        const hideModified = GM_getValue(HIDE_MODIFIED, HIDE_MODIFIED_DEFAULT);
        const hideSideMenu = GM_getValue(HIDE_SIDEMENU, HIDE_SIDEMENU_DEFAULT);
        const resizeMedia = GM_getValue(RESIZE_MEDIA, RESIZE_MEDIA_DEFAULT);

        fixHeaderElement.value = fixHeader;
        hideAvatarElement.value = hideAvatar;
        hideModifiedElement.value = hideModified;
        hideSideMenuElement.value = hideSideMenu;
        resizeMediaElement.value = resizeMedia;
    }
    function save() {
        GM_setValue(FIX_HEADER, fixHeaderElement.value == 'true');
        GM_setValue(HIDE_AVATAR, hideAvatarElement.value == 'true');
        GM_setValue(HIDE_MODIFIED, hideModifiedElement.value == 'true');
        GM_setValue(HIDE_SIDEMENU, hideSideMenuElement.value == 'true');
        GM_setValue(RESIZE_MEDIA, resizeMediaElement.value);
    }

    Setting.registConfig(configElement, Setting.categoryKey.INTERFACE, save, load);
}

function apply() {
    document.head.append(<style>{sheetLiveModifier}</style>);
    const contentWrapper = document.querySelector('.content-wrapper');

    const fixHeader = GM_getValue(FIX_HEADER, FIX_HEADER_DEFAULT);
    if(fixHeader) document.body.classList.add('fix-header');

    const hideAvatar = GM_getValue(HIDE_AVATAR, HIDE_AVATAR_DEFAULT);
    if(hideAvatar) contentWrapper.classList.add('hide-avatar');

    const hideModified = GM_getValue(HIDE_MODIFIED, HIDE_MODIFIED_DEFAULT);
    if(hideModified) contentWrapper.classList.add('hide-modified');

    const hideSideMenu = GM_getValue(HIDE_SIDEMENU, HIDE_SIDEMENU_DEFAULT);
    if(hideSideMenu) contentWrapper.classList.add('hide-sidemenu');

    const resizeMedia = GM_getValue(RESIZE_MEDIA, RESIZE_MEDIA_DEFAULT);
    const css = `.article-body img, .article-body video {
        max-width: ${resizeMedia}% !important;
    }`;

    document.head.append(<style>{css}</style>);
}
