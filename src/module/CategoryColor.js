import Configure from '../core/Configure';
import Parser from '../core/Parser';

import AutoRefresher from './AutoRefresher';
import { getRandomColor, getContrastYIQ } from '../util/ColorManager';

export default { load };

const CATEGORY_COLOR = { key: 'categoryColor', defaultValue: {} };

function load() {
    try {
        addSetting();

        if(Parser.hasBoard()) {
            generateColorStyle();
            apply();
        }

        AutoRefresher.addRefreshCallback({
            priority: 0,
            callback: apply,
        });
    }
    catch(error) {
        console.error(error);
    }
}

function addSetting() {
    // 카테고리 목록 등록
    const boardCategoryElements = document.querySelectorAll('.board-category a');
    if(!boardCategoryElements.length) return;

    const tbody = <tbody />;
    const table = (
        <table class="table align-middle">
            <colgroup>
                <col width="40%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
            </colgroup>
            <thead>
                <th>이름</th>
                <th>뱃지색</th>
                <th>배경색</th>
                <th>굵게</th>
            </thead>
            {tbody}
        </table>
    );

    for(const element of boardCategoryElements) {
        const name = element.textContent == '전체' ? '일반' : element.textContent;
        tbody.append(
            <tr data-id={name}>
                <td><span class="badge badge-success" style="margin: .25em">{`${name}`}</span><span class="title">제목</span></td>
                <td><input type="text" name="badge" placeholder="000000" maxlength="6" disabled={name == '일반'} /></td>
                <td><input type="text" name="bg" placeholder="000000" maxlength="6" /></td>
                <td><label><input type="checkbox" name="bold" style="margin: .25em" /> 적용</label></td>
            </tr>,
        );
    }

    // 이벤트 핸들러
    tbody.addEventListener('keypress', event => {
        const regex = /[0-9a-fA-F]/;
        if(!regex.test(event.key)) event.preventDefault();
    });
    tbody.addEventListener('dblclick', event => {
        if(event.target.tagName != 'INPUT') return;
        if(event.target.disabled) return;

        const color = getRandomColor();
        const yiq = getContrastYIQ(color);

        if(event.target.name == 'badge') {
            event.target.value = color;
            event.target.closest('tr').querySelector('.badge').style.backgroundColor = `#${color}`;
            event.target.closest('tr').querySelector('.badge').style.color = yiq;
        }
        if(event.target.name == 'bg') {
            event.target.value = color;
            event.target.closest('tr').querySelector('td').style.backgroundColor = `#${color}`;
            event.target.closest('tr').querySelector('.title').style.color = yiq;
        }
    });
    tbody.addEventListener('input', event => {
        let color = '';
        let yiq = '';

        if(event.target.value.length == 6) {
            color = `#${event.target.value}`;
            yiq = getContrastYIQ(event.target.value);
        }

        if(event.target.name == 'badge') {
            event.target.closest('tr').querySelector('.badge').style.backgroundColor = color;
            event.target.closest('tr').querySelector('.badge').style.color = yiq;
        }
        if(event.target.name == 'bg') {
            event.target.closest('tr').querySelector('td').style.backgroundColor = color;
            event.target.closest('tr').querySelector('.title').style.color = yiq;
        }
        if(event.target.name == 'bold') {
            event.target.closest('tr').querySelector('.title').style.fontWeight = event.target.checked ? 'bold' : '';
        }
    });

    const channel = Parser.getChannelInfo().id;

    Configure.addSetting({
        category: Configure.categoryKey.INTERFACE,
        header: '카테고리 색상 설정',
        option: table,
        description: '더블 클릭으로 무작위 색상을 선택할 수 있습니다.',
        callback: {
            save() {
                const colorConfig = Configure.get(CATEGORY_COLOR);

                const rows = tbody.querySelectorAll('tr');
                for(const row of rows) {
                    const { id } = row.dataset;
                    const badge = row.querySelector('input[name="badge"]').value.toUpperCase();
                    const bgcolor = row.querySelector('input[name="bg"]').value.toUpperCase();
                    const bold = row.querySelector('input[name="bold"]').checked;

                    if(badge || bgcolor || bold) {
                        colorConfig[channel] = {
                            ...colorConfig[channel],
                            [id]: {
                                badge,
                                bgcolor,
                                bold,
                            },
                        };
                    }
                    else {
                        if(colorConfig[channel][id]) {
                            delete colorConfig[channel][id];
                        }
                    }
                }

                Configure.set(CATEGORY_COLOR, colorConfig);
            },
            load() {
                const channelConfig = Configure.get(CATEGORY_COLOR)[channel];
                if(!channelConfig) return;

                for(const element of tbody.children) {
                    const { id } = element.dataset;

                    if(channelConfig[id]) {
                        const { badge, bgcolor, bold } = channelConfig[id];

                        const tdElement = element.querySelector('td');
                        const badgeElement = element.querySelector('.badge');
                        const titleElement = element.querySelector('.title');
                        const badgeInput = element.querySelector('input[name="badge"]');
                        const bgInput = element.querySelector('input[name="bg"]');
                        const boldInput = element.querySelector('input[name="bold"]');

                        badgeInput.value = badge;
                        if(badge) {
                            badgeElement.style.backgroundColor = `#${badge}`;
                            badgeElement.style.color = getContrastYIQ(badge);
                        }

                        bgInput.value = bgcolor;
                        if(bgcolor) {
                            tdElement.style.backgroundColor = `#${bgcolor}`;
                            titleElement.style.color = getContrastYIQ(bgcolor);
                        }

                        boldInput.checked = bold;
                        if(bold) {
                            titleElement.style.fontWeight = 'bold';
                        }
                    }
                }
            },
        },
    });
}

const styleTable = {};

function generateColorStyle() {
    const channel = Parser.getChannelInfo().id;
    const categoryConfig = Configure.get(CATEGORY_COLOR)[channel];

    if(!categoryConfig) return;

    const style = [];
    for(const key in categoryConfig) {
        if(categoryConfig[key]) {
            const { badge, bgcolor, bold } = categoryConfig[key];
            let styleKey;
            do {
                styleKey = Math.random().toString(36).substr(2);
            } while(styleTable[styleKey]);

            style.push(`
                .color_${styleKey} {
                    background-color: #${bgcolor};
                    color: ${getContrastYIQ(bgcolor)};
                    font-weight: ${bold ? 'bold' : 'normal'}
                }
    
                .color_${styleKey} .badge {
                    background-color: #${badge};
                    color: ${getContrastYIQ(badge)};
                }
            `);
            styleTable[key] = styleKey;
        }
    }

    document.head.append(<style>{style.join('\n')}</style>);
}

function apply() {
    const articles = Parser.queryItems('articles', 'board');

    articles.forEach(article => {
        if(article.childElementCount < 2) return;

        const categoryElement = article.querySelector('.badge');
        if(!categoryElement) return;
        const category = (categoryElement.textContent) ? categoryElement.textContent : '일반';
        if(!styleTable[category]) return;

        article.classList.add(`color_${styleTable[category]}`);
    });
}
