import { HEADER_LOADED } from '../core/ArcaSelector';
import { addSetting, getValue, setValue } from '../core/Configure';
import { waitForElement } from '../core/LoadManager';
import { parseChannelID } from '../core/Parser';

import styles, { stylesheet } from '../css/ThemeCustomizer.module.css';

const defaultTheme = {
  'bg-navbar': '3d414d',
  'bg-body': 'eee',
  'bg-main': 'fff',
  'bg-focus': 'eee',
  'bg-dropdown': 'fff',
  'bg-dialog': 'fff',
  'bg-input': 'fff',
  'bg-badge': '3d414d',
  'bg-footer': 'fff',
  'text-color': '373a3c',
  'text-muted': '9ba0a4',
  'link-color': '5b91bf',
  'visited-article': 'bbb',
  'border-outer': 'bbb',
  'border-inner': 'ddd',
};

const description = {
  'bg-navbar': '네비게이션 색상',
  'bg-body': '배경 색상',
  'bg-main': '메인 색상',
  'bg-focus': '포커스 색상',
  'bg-dropdown': '드롭다운 색상',
  'bg-dialog': '다이얼로그 색상',
  'bg-input': '입력칸 색상',
  'bg-badge': '글머리 색상',
  'bg-footer': '푸터 색상',
  'text-color': '텍스트 색상',
  'text-muted': '뮤트 색상',
  'link-color': '링크 색상',
  'visited-article': '방문한 게시물 색상',
  'border-outer': '경계선 외곽선 색상',
  'border-inner': '경계선 내부선 색상',
};

const NONE_PRESET = '%NONE%';
const NEW_PRESET = '%NEW_PRESET%';

const CURRENT_THEME = { key: 'currentTheme', defaultValue: NONE_PRESET };
const THEME_PRESET = { key: 'themePreset', defaultValue: {} };

export async function load() {
  try {
    await waitForElement(HEADER_LOADED);
    setupSetting();
    applyTheme();
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const themePreset = getValue(THEME_PRESET);

  const presetSelect = (
    <select>
      <option value={NONE_PRESET}>사용 안 함</option>
      <option value={NEW_PRESET}>새 프리셋 추가</option>
      {Object.keys(themePreset).map((key) => (
        <option value={key}>{key}</option>
      ))}
    </select>
  );
  let prevValue = NONE_PRESET;
  presetSelect.addEventListener('change', (e) => {
    if (prevValue !== NONE_PRESET) {
      Object.keys(themePreset[prevValue]).forEach((key) => {
        themePreset[prevValue][key] = inputMap[key].value;
      });
    }

    if (presetSelect.value === NEW_PRESET) {
      const newPresetKey = prompt('새로운 프리셋 이름');
      if (newPresetKey) {
        themePreset[newPresetKey] = { ...defaultTheme };
        presetSelect.append(<option value={newPresetKey}>{newPresetKey}</option>);
        presetSelect.querySelector(`option[value="${newPresetKey}"]`).selected = true;
      } else {
        presetSelect.querySelector(`option[value="${prevValue}"]`).selected = true;
      }
    }

    if (presetSelect.value === NONE_PRESET) {
      Object.keys(inputMap).forEach((key) => {
        inputMap[key].disabled = true;
        inputMap[key].value = '';
      });
      presetDeleteBtn.disabled = true;
    } else {
      Object.keys(inputMap).forEach((key) => {
        inputMap[key].disabled = false;
        inputMap[key].value = themePreset[presetSelect.value][key];
      });
      presetDeleteBtn.disabled = false;
    }
    prevValue = presetSelect.value;
  });

  const presetDeleteBtn = <button className="btn btn-danger">삭제</button>;
  presetDeleteBtn.addEventListener('click', (e) => {
    const current = presetSelect.value;
    if (current !== NONE_PRESET) {
      delete themePreset[current];
      presetSelect.querySelector(`option[value="${current}"]`).remove();
      presetSelect.querySelector(`option[value="${NONE_PRESET}"]`).selected = true;
      prevValue = NONE_PRESET;
      presetSelect.dispatchEvent(new Event('change'));
    }
  });
  const presetWrapper = (
    <div className={styles['preset-wrapper']}>
      {presetSelect}
      {presetDeleteBtn}
    </div>
  );

  const inputMap = Object.keys(defaultTheme).reduce((acc, cur) => {
    return { ...acc, [cur]: <input type="text" placeholder={defaultTheme[cur]} maxLength="6" /> };
  }, {});
  const content = (
    <div className={styles.wrapper}>
      <style>{stylesheet}</style>
      {presetWrapper}
      {Object.keys(inputMap).map((key) => (
        <div className={styles.item}>
          <div>{description[key]}</div>
          {inputMap[key]}
        </div>
      ))}
    </div>
  );

  addSetting({
    header: '사이트 테마 커스터마이징',
    group: [
      {
        title: '색상 설정',
        description: '프리셋 이름을 채널 slug로 지정하면 채널 전용 테마로 사용할 수 있습니다.',
        content,
        type: 'wide',
      },
    ],
    configHandler: {
      save() {
        if (presetSelect.value !== NONE_PRESET) {
          Object.keys(themePreset[prevValue]).forEach((key) => {
            themePreset[prevValue][key] = inputMap[key].value;
          });
        }

        setValue(CURRENT_THEME, presetSelect.value);
        setValue(THEME_PRESET, themePreset);
      },
      load() {
        const currentTheme = getValue(CURRENT_THEME);
        if (currentTheme) {
          presetSelect.querySelector(`option[value="${currentTheme}"]`).selected = true;
        }
        presetSelect.dispatchEvent(new Event('change'));
      },
    },
  });
}

function applyTheme() {
  const themePreset = getValue(THEME_PRESET);
  const channelID = parseChannelID();
  const currentTheme = getValue(CURRENT_THEME);
  if (!themePreset[channelID] && currentTheme === NONE_PRESET) return;

  const theme = themePreset[channelID] || themePreset[currentTheme];

  document.head.append(
    <style>
      {`
        html.theme-custom {
          ${Object.keys(theme)
            .map((key) => {
              return `--color-${key}: #${theme[key]} !important;`;
            })
            .join('\n')}
        }
      `}
    </style>
  );
  document.documentElement.classList.add('theme-custom');
}
