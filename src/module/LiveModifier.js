import DefaultConfig from '../core/DefaultConfig';

import sheetLiveModifier from '../css/LiveModifier.css';

export default { apply, applyImageResize };

function apply() {
    document.head.append(<style>{sheetLiveModifier}</style>);
    const contentWrapper = document.querySelector('.content-wrapper');

    const fixHeader = GM_getValue('fixHeader', DefaultConfig.fixHeader);
    if(fixHeader) document.body.classList.add('fix-header');

    const hideAvatar = GM_getValue('hideAvatar', DefaultConfig.hideAvatar);
    if(hideAvatar) contentWrapper.classList.add('hide-avatar');

    const hideModified = GM_getValue('hideModified', DefaultConfig.hideModified);
    if(hideModified) contentWrapper.classList.add('hide-modified');

    const hideSideMenu = GM_getValue('hideSideMenu', DefaultConfig.hideSideMenu);
    if(hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
}

function applyImageResize() {
    const resizeMedia = GM_getValue('resizeMedia', DefaultConfig.resizeMedia);
    const css = `.article-body img, .article-body video {
        max-width: ${resizeMedia}% !important;
    }`;

    document.head.append(<style>{css}</style>);
}
