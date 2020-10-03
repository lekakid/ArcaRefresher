import DefaultConfig from '../core/DefaultConfig';

import sheetLiveModifier from '../css/LiveModifier.css';

export default { apply };

function apply() {
    document.head.append(<style>{sheetLiveModifier}</style>);
    const contentWrapper = document.querySelector('.content-wrapper');

    const fixHeader = GM_getValue('fixHeader', DefaultConfig.fixHeader);
    if(fixHeader) document.body.classList.add('fix-header');

    const hideAvatar = GM_getValue('hideAvatar', DefaultConfig.hideAvatar);
    if(hideAvatar) contentWrapper.classList.add('hide-avatar');

    const hideMedia = GM_getValue('hideMedia', DefaultConfig.hideMedia);
    if(hideMedia) contentWrapper.classList.add('hide-media');

    const hideModified = GM_getValue('hideModified', DefaultConfig.hideModified);
    if(hideModified) contentWrapper.classList.add('hide-modified');

    const hideSideMenu = GM_getValue('hideSideMenu', DefaultConfig.hideSideMenu);
    if(hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
}
