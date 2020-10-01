import DefaultConfig from '../core/DefaultConfig';

import sheetLiveModifier from '../css/LiveModifier.css';

export default { apply };

function apply() {
    document.head.append(<style>{sheetLiveModifier}</style>);

    const fixHeader = GM_getValue('fixHeader', DefaultConfig.fixHeader);
    const hideAvatar = GM_getValue('hideAvatar', DefaultConfig.hideAvatar);
    const hideMedia = GM_getValue('hideMedia', DefaultConfig.hideMedia);
    const hideModified = GM_getValue('hideModified', DefaultConfig.hideModified);
    const hideSideMenu = GM_getValue('hideSideMenu', DefaultConfig.hideSideMenu);

    const contentWrapper = document.querySelector('.content-wrapper');

    if(fixHeader) document.body.classList.add('fix-header');
    if(hideAvatar) contentWrapper.classList.add('hide-avatar');
    if(hideMedia) contentWrapper.classList.add('hide-media');
    if(hideModified) contentWrapper.classList.add('hide-modified');
    if(hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
}
