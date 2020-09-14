import { defaultConfig } from './Setting';

export function apply() {
    const hideAvatar = GM_getValue('hideAvatar', defaultConfig.hideAvatar);
    const hideMedia = GM_getValue('hideMedia', defaultConfig.hideMedia);
    const hideModified = GM_getValue('hideModified', defaultConfig.hideModified);
    const hideSideMenu = GM_getValue('hideSideMenu', defaultConfig.hideSideMenu);

    const contentWrapper = document.querySelector('.content-wrapper');

    if(hideAvatar) contentWrapper.classList.add('hide-avatar');
    if(hideMedia) contentWrapper.classList.add('hide-media');
    if(hideModified) contentWrapper.classList.add('hide-modified');
    if(hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
}
