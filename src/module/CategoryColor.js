import { addSetting, getValue, setValue } from '../core/Configure';
import { CurrentPage } from '../core/Parser';

import AutoRefresher from './AutoRefresher';
import { getRandomColor, getContrastYIQ } from '../util/ColorManager';

import styles, { stylesheet } from '../css/CategoryColor.module.css';

export default { load };

const CATEGORY_COLOR = { key: 'categoryColor', defaultValue: {} };

function load() {
  try {
    setupSetting();

    if (CurrentPage.Component.Board) {
      generateColorStyle();
      apply();
    }

    AutoRefresher.addRefreshCallback({
      priority: 0,
      callback: apply,
    });
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  // 카테고리 목록 등록
  const settingWrapper = (
    <div className={styles.wrapper}>
      <style>{stylesheet}</style>
      {CurrentPage.Category.map((category) => {
        let name = category;
        if (category === '전체') name = '일반';

        return (
          <div className={styles.item} data-id={name}>
            <div>
              <span className="badge badge-success" style={{ margin: '0.25rem' }}>
                {name}
              </span>
              제목
            </div>
            <div>
              <input
                type="text"
                name="bg"
                placeholder="뱃지색"
                maxLength="6"
                disabled={name === '일반'}
              />
            </div>
            <div>
              <input type="text" name="badge" placeholder="배경색" maxLength="6" />
            </div>
            <div>
              <label>
                <input type="checkbox" name="bold" style={{ margin: '0.25rem' }} /> 굵게
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );

  // 이벤트 핸들러
  settingWrapper.addEventListener('keypress', (event) => {
    const regex = /[0-9a-fA-F]/;
    if (!regex.test(event.key)) event.preventDefault();
  });
  settingWrapper.addEventListener('dblclick', (event) => {
    if (event.target.tagName !== 'INPUT') return;
    if (event.target.disabled) return;

    const row = event.target.closest(`.${styles.item}`);
    const color = getRandomColor();
    const yiq = getContrastYIQ(color);

    if (event.target.name === 'badge') {
      event.target.value = color;
      row.querySelector('.badge').style.backgroundColor = `#${color}`;
      row.querySelector('.badge').style.color = yiq;
    }
    if (event.target.name === 'bg') {
      event.target.value = color;
      row.querySelector('td').style.backgroundColor = `#${color}`;
      row.querySelector('.title').style.color = yiq;
    }
  });
  settingWrapper.addEventListener('input', (event) => {
    let color = '';
    let yiq = '';

    const row = event.target.closest(`.${styles.item}`);

    if (event.target.value.length === 6) {
      color = `#${event.target.value}`;
      yiq = getContrastYIQ(event.target.value);
    }

    if (event.target.name === 'badge') {
      row.querySelector('.badge').style.backgroundColor = color;
      row.querySelector('.badge').style.color = yiq;
    }
    if (event.target.name === 'bg') {
      row.querySelector('td').style.backgroundColor = color;
      row.style.color = yiq;
    }
    if (event.target.name === 'bold') {
      row.style.fontWeight = event.target.checked ? 'bold' : '';
    }
  });

  const channel = CurrentPage.Channel.ID;

  addSetting({
    header: '카테고리 색상 설정',
    group: [
      {
        title: '색상 변경',
        description: '더블 클릭으로 무작위 색상을 선택합니다.',
        content: settingWrapper,
        type: 'wide',
      },
    ],
    valueCallback: {
      save() {
        const config = getValue(CATEGORY_COLOR);
        let channelConfig = config[channel];
        if (!channelConfig) channelConfig = {};

        const rows = settingWrapper.querySelectorAll(`.${styles.item}`);
        for (const row of rows) {
          const id = row.dataset.id;
          const badge = row.querySelector('input[name="badge"]').value.toUpperCase();
          const bgcolor = row.querySelector('input[name="bg"]').value.toUpperCase();
          const bold = row.querySelector('input[name="bold"]').checked;

          if (badge || bgcolor || bold) {
            channelConfig[id] = {
              badge,
              bgcolor,
              bold,
            };
          } else {
            delete channelConfig[id];
          }
        }

        setValue(CATEGORY_COLOR, { ...config, [channel]: channelConfig });
      },
      load() {
        const config = getValue(CATEGORY_COLOR)[channel];
        if (!config) return;

        const rows = settingWrapper.querySelectorAll(`.${styles.item}`);
        for (const row of rows) {
          const id = row.dataset.id;

          if (config[id]) {
            const { badge, bgcolor, bold } = config[id];

            const backgroundElement = row.querySelector('div:first-child');
            const badgeElement = row.querySelector('.badge');
            const badgeInput = row.querySelector('input[name="badge"]');
            const bgInput = row.querySelector('input[name="bg"]');
            const boldInput = row.querySelector('input[name="bold"]');

            badgeInput.value = badge;
            if (badge) {
              badgeElement.style.backgroundColor = `#${badge}`;
              badgeElement.style.color = getContrastYIQ(badge);
            }

            bgInput.value = bgcolor;
            if (bgcolor) {
              backgroundElement.style.backgroundColor = `#${bgcolor}`;
              backgroundElement.style.color = getContrastYIQ(bgcolor);
            }

            boldInput.checked = bold;
            if (bold) {
              backgroundElement.style.fontWeight = 'bold';
            }
          }
        }
      },
    },
  });
}

const styleTable = {};

function generateColorStyle() {
  const channel = CurrentPage.Channel.ID;
  const categoryConfig = getValue(CATEGORY_COLOR)[channel];

  if (!categoryConfig) return;

  const style = [];
  for (const key in categoryConfig) {
    if (categoryConfig[key]) {
      const { badge, bgcolor, bold } = categoryConfig[key];
      let styleKey;
      do {
        styleKey = Math.random().toString(36).substr(2);
      } while (styleTable[styleKey]);

      style.push(
        `
          .color_${styleKey} {
            background-color: #${bgcolor} !important;
            color: ${getContrastYIQ(bgcolor)};
            font-weight: ${bold ? 'bold' : 'normal'}
          }

          .color_${styleKey} .badge {
            background-color: #${badge} !important;
            color: ${getContrastYIQ(badge)};
          }
        `
      );
      styleTable[key] = styleKey;
    }
  }

  document.head.append(<style>{style.join('\n')}</style>);
}

function apply() {
  const articles = document.querySelectorAll('a.vrow:not(.notice)');

  articles.forEach((article) => {
    if (article.childElementCount < 2) return;

    const categoryElement = article.querySelector('.badge');
    if (!categoryElement) return;
    const category = categoryElement.textContent ? categoryElement.textContent : '일반';
    if (!styleTable[category]) return;

    article.classList.add(`color_${styleTable[category]}`);
  });
}
