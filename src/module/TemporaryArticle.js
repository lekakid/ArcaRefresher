import Configure from '../core/Configure';
import { getDateStr } from '../util/DateManager';
import { waitForElement } from '../util/ElementDetector';

import stylesheet from '../css/TemporaryArticle.css';

export default { load };

const TEMPORARY_ARTICLES = { key: 'tempArticles', defaultValue: {} };

async function load() {
    try {
        await waitForElement('.fr-box');
        apply();
    }
    catch(error) {
        console.error(error);
    }
}

function apply() {
    const editor = unsafeWindow.FroalaEditor('#content');
    const tempArticles = Configure.get(TEMPORARY_ARTICLES);

    const selectAll = <input type="checkbox" name="selectAll" />;
    const deleteBtn = <button class="btn btn-danger" id="tempDeleteBtn">삭제</button>;
    const closeBtn = <button class="btn btn-arca" id="tempCloseBtn">닫기</button>;
    const list = <tbody />;
    const wrapper = (
        <div class="hidden" id="tempArticleWrapper">
            <style>{stylesheet}</style>
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>{selectAll}</th>
                        <th>제목</th>
                        <th>시간</th>
                    </tr>
                </thead>
                {list}
                <tfoot>
                    <td colspan="3" style="text-align:center;">
                        {deleteBtn}
                        {closeBtn}
                    </td>
                </tfoot>
            </table>
        </div>
    );

    function loadArticle() {
        selectAll.checked = false;

        while(list.firstChild) list.lastChild.remove();
        for(const key of Object.keys(tempArticles)) {
            list.append(
                <tr data-id={key}>
                    <td><input type="checkbox" name="select" /></td>
                    <td><a href="#">{tempArticles[key].title}</a></td>
                    <td>{getDateStr(tempArticles[key].time).split(' ')[0]}</td>
                </tr>,
            );
        }
    }

    wrapper.addEventListener('click', event => {
        if(event.target.name == 'selectAll') {
            list.querySelectorAll('input[name="select"]').forEach(e => {
                e.checked = event.target.checked;
            });
        }

        if(event.target.tagName == 'A') {
            const row = event.target.closest('tr');
            const id = row.dataset.id;
            const title = document.querySelector('#inputTitle');
            title.value = tempArticles[id].title;
            editor.html.set(tempArticles[id].content);
            wrapper.classList.add('hidden');
        }

        if(!event.target.closest('table')) {
            wrapper.classList.add('hidden');
        }
    });
    deleteBtn.addEventListener('click', event => {
        event.preventDefault();

        const checkedItems = list.querySelectorAll('input[name="select"]:checked');
        checkedItems.forEach(i => {
            const row = i.closest('tr');
            const id = row.dataset.id;
            delete tempArticles[id];
        });

        Configure.set(TEMPORARY_ARTICLES, tempArticles);
        loadArticle();
    });
    closeBtn.addEventListener('click', event => {
        event.preventDefault();

        wrapper.classList.add('hidden');
    });

    const btns = document.querySelector('.btns');
    const saveBtn = <button class="btn btn-primary" id="tempSaveBtn">임시 저장</button>;
    const loadBtn = <button class="btn btn-arca" id="tempLoadBtn">불러오기</button>;
    const submitBtn = btns.querySelector('#submitBtn');
    btns.insertAdjacentElement('afterend', wrapper);
    btns.prepend(
        <>
            <style>
                {`
                    .btns {
                        display: grid;
                        grid-template-columns: 7rem 7rem 1fr 7rem;
                        grid-template-areas:
                            "  save     load     .   submit"
                            "recapcha recapcha recapcha recapcha";
                        grid-row-gap: 1rem;
                    }
                    .btns > #tempSaveBtn { grid-area: save; }
                    .btns > #tempLoadBtn { grid-area: load; }
                    .btns > div { grid-area: recapcha; }
                    .btns > #submitBtn { grid-area: submit; }
                `}
            </style>
            {saveBtn}
            {loadBtn}
            {submitBtn}
        </>,
    );

    saveBtn.addEventListener('click', event => {
        event.preventDefault();
        const timestamp = new Date().getTime();

        const title = document.querySelector('#inputTitle').value;

        tempArticles[timestamp] = {
            title: title || '제목 없음',
            time: timestamp,
            content: editor.html.get(true),
        };
        if(!wrapper.classList.contains('hidden')) {
            loadArticle();
        }
        Configure.set(TEMPORARY_ARTICLES, tempArticles);
        alert('작성 중인 게시물이 저장되었습니다.');
    });
    loadBtn.addEventListener('click', event => {
        event.preventDefault();

        if(wrapper.classList.contains('hidden')) {
            loadArticle();

            wrapper.classList.remove('hidden');
        }
    });
}
