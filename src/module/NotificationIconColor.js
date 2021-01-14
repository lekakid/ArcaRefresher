import { categoryKey, addSetting, getValue, setValue } from '../core/Configure';
import { getRandomColor } from '../util/ColorManager';

export default { load };

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
  const inputElement = <input type="text" placeholder="FFC107" />;
  const notificationIcon = document.querySelector('.navbar-wrapper .noti-menu-link span');

  // 이벤트 핸들러
  inputElement.addEventListener('keypress', (event) => {
    const regex = /[0-9a-fA-F]/;
    if (!regex.test(event.key)) event.preventDefault();
  });
  inputElement.addEventListener('dblclick', (event) => {
    const color = getRandomColor();

    event.target.value = color;
    notificationIcon.style.color = `#${color}`;
  });
  inputElement.addEventListener('input', (event) => {
    let color = '';

    if (event.target.value.length === 6) {
      color = `#${event.target.value}`;
    }

    notificationIcon.style.color = color;
  });

  addSetting({
    category: categoryKey.INTERFACE,
    header: '알림 아이콘 색상 변경',
    view: inputElement,
    description: (
      <>
        알림 아이콘의 점등 색상을 변경합니다.
        <br />
        색상을 입력하면 알림 아이콘에서 미리 볼 수 있습니다.
        <br />
        더블 클릭으로 무작위 색상을 선택할 수 있습니다.
      </>
    ),
    valueCallback: {
      save() {
        setValue(NOTIFY_COLOR, inputElement.value);
      },
      load() {
        inputElement.value = getValue(NOTIFY_COLOR);
      },
    },
  });
}

function apply() {
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
