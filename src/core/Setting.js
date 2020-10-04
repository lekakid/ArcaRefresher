import View from './SettingView';
import DefaultConfig from './DefaultConfig';

import { getContrastYIQ, getRandomColor } from '../util/ColorManager';

export default { importConfig, setup, setupCategory };

function importConfig(JSONString) {
    const data = JSON.parse(JSONString);

    for(const key of Object.keys(data)) {
        if({}.hasOwnProperty.call(DefaultConfig, key)) {
            if(data[key]) GM_setValue(key, data[key]);
        }
    }
}

function exportConfig() {
    const keys = GM_listValues();
    const config = {};

    for(const key of keys) {
        config[key] = GM_getValue(key);
    }

    const result = JSON.stringify(config);
    return result;
}

function reset() {
    const keys = GM_listValues();

    for(const key of keys) {
        GM_deleteValue(key);
    }
}

function setup() {
    // 스크립트 설정 버튼 엘리먼트
    const showSettingBtn = (
        <li class="nav-item dropdown" id="showSetting">
            <a aria-expanded="false" class="nav-link" href="#">
                <span class="d-none d-sm-block">스크립트 설정</span>
                <span class="d-block d-sm-none"><span class="ion-gear-a" /></span>
            </a>
        </li>
    );

    // 설정 뷰
    const settingWrapper = View;
    const contentWrapper = document.querySelector('.content-wrapper');

    // 설정 버튼 클릭 이벤트
    showSettingBtn.addEventListener('click', () => {
        if(settingWrapper.classList.contains('hidden')) {
            loadConfig();
            contentWrapper.classList.add('disappear');
        }
        else {
            settingWrapper.classList.add('disappear');
        }
    });

    // 애니메이션 처리
    contentWrapper.addEventListener('animationend', () => {
        if(contentWrapper.classList.contains('disappear')) {
            contentWrapper.classList.add('hidden');
            contentWrapper.classList.remove('disappear');
            settingWrapper.classList.add('appear');
            settingWrapper.classList.remove('hidden');
        }
        else if(contentWrapper.classList.contains('appear')) {
            contentWrapper.classList.remove('appear');
        }
    });
    settingWrapper.addEventListener('animationend', () => {
        if(settingWrapper.classList.contains('disappear')) {
            settingWrapper.classList.add('hidden');
            settingWrapper.classList.remove('disappear');
            contentWrapper.classList.add('appear');
            contentWrapper.classList.remove('hidden');
        }
        else if(settingWrapper.classList.contains('appear')) {
            settingWrapper.classList.remove('appear');
        }
    });

    // 헤더에 버튼 부착
    document.querySelector('ul.navbar-nav').append(showSettingBtn);
    contentWrapper.insertAdjacentElement('afterend', settingWrapper);

    const comboElements = settingWrapper.querySelectorAll('select:not([multiple])');
    const textareaElements = settingWrapper.querySelectorAll('textarea');
    const textElements = settingWrapper.querySelectorAll('input[type="text"]');
    const listElements = settingWrapper.querySelectorAll('select[multiple]');
    for(const element of listElements) {
        const btnElement = <button href="#" class="btn btn-success">삭제</button>;
        btnElement.addEventListener('click', event => {
            event.target.disabled = true;

            const removeElements = element.selectedOptions;
            while(removeElements.length > 0) removeElements[0].remove();

            event.target.disabled = false;
        });
        element.insertAdjacentElement('afterend', btnElement);
    }
    // 이벤트 핸들러
    settingWrapper.querySelector('#removeMyImage').addEventListener('click', event => {
        event.target.disabled = true;
        if(confirm('등록한 자짤을 삭제하시겠습니까?')) {
            GM_setValue('myImage', '');
            alert('삭제되었습니다.');
        }
        event.target.disabled = false;
    });
    settingWrapper.querySelector('#exportConfig').addEventListener('click', event => {
        event.preventDefault();

        const data = btoa(encodeURIComponent(exportConfig()));
        navigator.clipboard.writeText(data);
        alert('클립보드에 설정이 복사되었습니다.');
    });
    settingWrapper.querySelector('#importConfig').addEventListener('click', event => {
        event.preventDefault();

        let data = prompt('가져올 설정 데이터를 입력해주세요');
        if(data == null) return;
        try {
            if(data == '') throw '[Setting/importConfig] 공백 값을 입력했습니다.';
            data = decodeURIComponent(atob(data));

            const config = JSON.parse(data);

            for(const key in config) {
                if({}.hasOwnProperty.call(config, key)) {
                    GM_setValue(key, config[key]);
                }
            }

            location.reload();
        }
        catch (error) {
            alert('올바르지 않은 데이터입니다.');
            console.error(error);
        }
    });
    settingWrapper.querySelector('#resetConfig').addEventListener('click', event => {
        event.preventDefault();

        if(!confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;

        reset();
        location.reload();
    });
    settingWrapper.querySelector('#saveAndClose').addEventListener('click', event => {
        event.preventDefault();

        for(const element of comboElements) {
            let value;
            switch(element.dataset.type) {
            case 'string':
                value = element.value;
                break;
            case 'number':
                value = Number(element.value);
                break;
            case 'bool':
                value = element.value == 'true';
                break;
            default:
                value = null;
                break;
            }
            GM_setValue(element.id, value);
        }

        for(const element of textElements) {
            GM_setValue(element.id, element.value);
        }

        for(const element of textareaElements) {
            let value;
            if(element.value != '') {
                value = element.value.split('\n');
                value = value.filter(item => {
                    return item != '';
                });
            }
            else {
                value = [];
            }
            GM_setValue(element.id, value);
        }

        for(const element of listElements) {
            const data = GM_getValue(element.id, DefaultConfig[element.id]);
            const options = element.querySelectorAll('option');
            const keys = Array.from(options, o => o.value);
            for(const key in data) {
                if(keys.indexOf(key) == -1) delete data[key];
            }
            GM_setValue(element.id, data);
        }

        if(settingWrapper.querySelector('#categorySetting tbody').childElementCount == 0) {
            location.reload();
        }
    });
    settingWrapper.querySelector('#closeSetting').addEventListener('click', () => {
        settingWrapper.classList.add('disappear');
    });
}

function loadConfig() {
    const settingWrapper = document.querySelector('#refresherSetting');

    // 설정 값 불러오기
    const comboElements = settingWrapper.querySelectorAll('select:not([multiple])');
    for(const element of comboElements) {
        element.value = GM_getValue(element.id, DefaultConfig[element.id]);
    }
    const textareaElements = settingWrapper.querySelectorAll('textarea');
    for(const element of textareaElements) {
        element.value = GM_getValue(element.id, DefaultConfig[element.id]).join('\n');
    }
    const textElements = settingWrapper.querySelectorAll('input[id][type="text"]');
    for(const element of textElements) {
        element.value = GM_getValue(element.id, DefaultConfig[element.id]);
    }
    const listElements = settingWrapper.querySelectorAll('select[multiple]');
    for(const element of listElements) {
        if(element.childElementCount) {
            while(element.childElementCount) element.removeChild(element.firstChild);
        }
        const data = GM_getValue(element.id, DefaultConfig[element.id]);
        for(const key of Object.keys(data)) {
            const option = <option />;
            option.value = key;

            const reservedWord = element.dataset.textFormat.match(/%\w*%/g);
            let text = element.dataset.textFormat;
            if(text != '') {
                for(const word of reservedWord) {
                    switch(word) {
                    case '%key%':
                        text = text.replace(word, key);
                        break;
                    case '%value%':
                        text = text.replace(word, data[key]);
                        break;
                    default:
                        text = text.replace(word, data[key][word.replace(/%/g, '')]);
                        break;
                    }
                }
            }
            else {
                text = key;
            }
            option.textContent = text;
            element.append(option);
        }
    }
}

function setupCategory(channel) {
    const settingWrapper = document.querySelector('#refresherSetting');
    const showSettingBtn = document.getElementById('showSetting');
    const categoryTable = settingWrapper.querySelector('#categorySetting tbody');

    // 설정 버튼 클릭 이벤트
    showSettingBtn.addEventListener('click', () => {
        if(settingWrapper.classList.contains('hidden')) {
            loadCategoryConfig(channel);
        }
    });

    // 카테고리 목록 등록
    const boardCategoryElements = document.querySelectorAll('.board-category a');

    for(const element of boardCategoryElements) {
        const name = element.textContent == '전체' ? '일반' : element.textContent;
        const tableCategoryElement = (
            <tr id={name}>
                <td>{name}</td>
                {name == '일반' && <td><input type="text" name="color" placeholder="000000" disabled="" /></td>}
                {name != '일반' && <td><input type="text" name="color" placeholder="000000" maxlength="6" /></td>}
                <td>
                    <label><input type="checkbox" name="blockPreview" /><span> 미리보기 숨김 </span></label>
                    <label><input type="checkbox" name="blockArticle" /><span> 게시물 뮤트 </span></label>
                </td>
            </tr>
        );
        categoryTable.append(tableCategoryElement);
    }

    // 이벤트 핸들러
    categoryTable.addEventListener('keypress', event => {
        const regex = /[0-9a-fA-F]/;
        if(!regex.test(event.key)) event.preventDefault();
    });
    categoryTable.addEventListener('dblclick', event => {
        if(event.target.name != 'color') return;
        if(event.target.disabled) return;

        const color = getRandomColor();
        event.target.value = color;
        event.target.style.backgroundColor = `#${color}`;
        event.target.style.color = getContrastYIQ(color);
    });
    categoryTable.addEventListener('input', event => {
        if(event.target.value.length == 6 || event.target.value.length == 3) {
            const color = event.target.value;
            const textColor = getContrastYIQ(color);

            event.target.style.backgroundColor = `#${color}`;
            event.target.style.color = textColor;
        }
        else {
            event.target.style.backgroundColor = '';
            event.target.style.color = '';
        }
    });
    settingWrapper.querySelector('#saveAndClose').addEventListener('click', event => {
        event.preventDefault();

        const categoryConfig = GM_getValue('category', DefaultConfig.category);
        const rows = settingWrapper.querySelectorAll('#categorySetting tr');
        if(categoryConfig[channel] == undefined) {
            categoryConfig[channel] = {};
        }

        for(const row of rows) {
            if(categoryConfig[channel][row.id] == undefined) {
                categoryConfig[channel][row.id] = {};
            }
            categoryConfig[channel][row.id].color = row.querySelector('[name="color"]').value.toUpperCase();
            categoryConfig[channel][row.id].blockPreview = row.querySelector('[name="blockPreview"]').checked;
            categoryConfig[channel][row.id].blockArticle = row.querySelector('[name="blockArticle"]').checked;
        }

        GM_setValue('category', categoryConfig);

        location.reload();
    });
}

function loadCategoryConfig(channel) {
    // 카테고리 설정 불러오기
    const categoryConfig = GM_getValue('category', DefaultConfig.category);
    if(categoryConfig[channel] == undefined) {
        categoryConfig[channel] = {};
    }

    for(const key of Object.keys(categoryConfig[channel])) {
        const row = document.getElementById(key);
        if(row) {
            const colorInput = row.querySelector('[name="color"]');
            colorInput.value = categoryConfig[channel][key].color;
            if(categoryConfig[channel][key].color == '') {
                colorInput.style.backgroundColor = '';
                colorInput.style.color = '';
            }
            else {
                colorInput.style.backgroundColor = `#${categoryConfig[channel][key].color}`;
                colorInput.style.color = getContrastYIQ(categoryConfig[channel][key].color);
            }
            row.querySelector('[name="blockPreview"]').checked = categoryConfig[channel][key].blockPreview;
            row.querySelector('[name="blockArticle"]').checked = categoryConfig[channel][key].blockArticle;
        }
    }
}
