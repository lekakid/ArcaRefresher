import DefaultConfig from '../core/DefaultConfig';

export default { apply };

function apply() {
    const color = GM_getValue('notificationIconColor', DefaultConfig.notificationIconColor);

    const notificationIcon = document.querySelector('.navbar-wrapper .noti-menu-link span');
    const notiObserver = new MutationObserver(() => {
        if(notificationIcon.style.color) {
            notificationIcon.style.color = `#${color}`;
        }
    });
    notiObserver.observe(notificationIcon, { attributes: true });
}
