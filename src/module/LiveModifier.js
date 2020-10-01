import { defaultConfig } from './Setting';

import sheetLiveModifier from '../css/LiveModifier.css';

export default { apply };

function apply() {
    document.head.append(<style>{sheetLiveModifier}</style>);

    const fixHeader = GM_getValue('fixHeader', defaultConfig.fixHeader);
    const hideAvatar = GM_getValue('hideAvatar', defaultConfig.hideAvatar);
    const hideMedia = GM_getValue('hideMedia', defaultConfig.hideMedia);
    const hideModified = GM_getValue('hideModified', defaultConfig.hideModified);
    const hideSideMenu = GM_getValue('hideSideMenu', defaultConfig.hideSideMenu);

    const contentWrapper = document.querySelector('.content-wrapper');

    if(fixHeader) document.body.classList.add('fix-header');
    if(hideAvatar) contentWrapper.classList.add('hide-avatar');
    if(hideMedia) contentWrapper.classList.add('hide-media');
    if(hideModified) contentWrapper.classList.add('hide-modified');
    if(hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
}
