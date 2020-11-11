import Setting from '../core/Setting';
import { getRandomColor } from '../util/ColorManager';

export default { initialize, apply };

const NOTIFY_COLOR = 'notificationIconColor';
const NOTIFY_COLOR_DEFAULT = '';

function initialize() {
    const configElement = (
        <>
            <label class="col-md-3">알림 아이콘 색상 변경</label>
            <div class="col-md-9">
                <input type="text" placeholder="FFC107" />
                <p>
                    알림 아이콘의 점등 색상을 변경합니다.<br />
                    색상을 입력하면 알림 아이콘에서 미리 볼 수 있습니다.<br />
                    더블 클릭으로 무작위 색상을 선택할 수 있습니다.
                </p>
            </div>
        </>
    );

    const inputElement = configElement.querySelector('input');
    const notificationIcon = document.querySelector('.navbar-wrapper .noti-menu-link span');

    // 이벤트 핸들러
    inputElement.addEventListener('keypress', event => {
        const regex = /[0-9a-fA-F]/;
        if(!regex.test(event.key)) event.preventDefault();
    });
    inputElement.addEventListener('dblclick', event => {
        const color = getRandomColor();

        event.target.value = color;
        notificationIcon.style.color = `#${color}`;
    });
    inputElement.addEventListener('input', event => {
        let color = '';

        if(event.target.value.length == 6) {
            color = `#${event.target.value}`;
        }

        notificationIcon.style.color = color;
    });

    function load() {
        const data = GM_getValue(NOTIFY_COLOR, NOTIFY_COLOR_DEFAULT);

        inputElement.value = data;
    }
    function save() {
        GM_setValue(NOTIFY_COLOR, inputElement.value);
    }

    Setting.registConfig(configElement, Setting.categoryKey.INTERFACE, save, load);
}

function apply() {
    const color = GM_getValue(NOTIFY_COLOR, NOTIFY_COLOR_DEFAULT);

    const notificationIcon = document.querySelector('.navbar-wrapper .noti-menu-link span');
    if(notificationIcon == null) return;

    const notiObserver = new MutationObserver(() => {
        if(notificationIcon.style.color) {
            notificationIcon.style.color = `#${color}`;
        }
    });
    notiObserver.observe(notificationIcon, { attributes: true });
}
