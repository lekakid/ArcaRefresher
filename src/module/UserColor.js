import { addSetting, getValue, setValue } from '../core/Configure';
import { addAREventListener } from '../core/AREventHandler';
import { CurrentPage, parseUserID } from '../core/Parser';

export default { load };

const USER_COLOR = { key: 'userColor', defaultValue: {} };

function load() {
  try {
    setupSetting();

    if (CurrentPage.Component.Board) {
      apply();
    }

    addAREventListener('ArticleChange', {
      priority: 0,
      callback: apply,
    });
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const userTextarea = <textarea rows="6" placeholder="닉네임::#000000" />;

  addSetting({
    header: '특정 유저 컬러라이징',
    group: [
      {
        title: '유저 목록',
        description: (
          <>
            아래의 양식을 지켜주시기 바랍니다.
            <br />
            <ul>
              <li>고정닉::#000000</li>
              <li>#00000000::#000000</li>
              <li>(000.000)::#000000</li>
            </ul>
          </>
        ),
        content: userTextarea,
        type: 'wide',
      },
    ],
    valueCallback: {
      save() {
        const userList = userTextarea.value.split('\n').filter((i) => i !== '');
        const data = {};
        for (const m of userList) {
          const [key, value] = m.split('::');
          data[key] = value;
        }

        setValue(USER_COLOR, data);
      },
      load() {
        const data = getValue(USER_COLOR);
        const userList = [];
        for (const key of Object.keys(data)) {
          userList.push(`${key}::${data[key]}`);
        }
        userTextarea.value = userList.join('\n');
      },
    },
  });
}

function apply() {
  const users = document.querySelectorAll('span.user-info');
  const colors = getValue(USER_COLOR);

  users.forEach((user) => {
    const id = parseUserID(user);

    if (colors[id]) {
      user.style.color = colors[id];
      user.style.fontWeight = 'bold';
    }
  });
}
