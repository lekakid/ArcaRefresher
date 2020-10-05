import { getDateStr } from '../util/DateManager';

import stylesheet from '../css/TemporaryArticle.css';

export default { apply };

function apply(editor) {
    const tempArticles = GM_getValue('tempArticles', {});

    const btns = document.querySelector('.btns');
    const list = (
        <table class="table align-middle hidden" id="articleList">
            <style>{stylesheet}</style>
            <thead>
                <tr>
                    <th><input type="checkbox" name="selectAll" /></th>
                    <th>제목</th>
                    <th>시간</th>
                </tr>
            </thead>
            <tbody />
            <tfoot>
                <td colspan="3" style="text-align:center;">
                    <button class="btn btn-danger" id="tempDeleteBtn">삭제</button>
                </td>
            </tfoot>
        </table>
    );
    const saveBtn = <a href="#" class="btn btn-primary" id="tempSaveBtn">임시 저장</a>;
    const loadBtn = <a href="#" class="btn btn-success" id="tempLoadBtn">불러오기</a>;
    const deleteBtn = list.querySelector('#tempDeleteBtn');
    const selectAll = list.querySelector('input[name="selectAll"]');
    const tbody = list.querySelector('tbody');

    function setPosition() {
        list.style.top = `${loadBtn.offsetTop - list.offsetHeight - 5}px`;
        list.style.left = `${loadBtn.offsetLeft - list.offsetWidth / 2}px`;
    }

    function loadArticle() {
        selectAll.checked = false;

        while(tbody.childElementCount) tbody.removeChild(tbody.childNodes[0]);
        for(const key of Object.keys(tempArticles)) {
            const row = (
                <tr>
                    <td><input type="checkbox" name="select" /></td>
                    <td><a href="#" data-id={key}>{tempArticles[key].title}</a></td>
                    <td>{getDateStr(tempArticles[key].time).split(' ')[0]}</td>
                </tr>
            );
            tbody.append(row);
        }
    }

    list.addEventListener('click', event => {
        if(event.target.name == 'selectAll') {
            list.querySelectorAll('input[name="select"]').forEach(e => {
                e.checked = event.target.checked;
            });
        }
        else if(event.target.tagName == 'A') {
            const id = event.target.dataset.id;
            const title = document.querySelector('#inputTitle');
            title.value = tempArticles[id].title;
            editor.html.set(tempArticles[id].content);
            list.classList.add('hidden');
        }
    });
    saveBtn.addEventListener('click', () => {
        const timestamp = new Date().getTime();

        const title = document.querySelector('#inputTitle').value;

        tempArticles[timestamp] = {
            title: title || '제목 없음',
            time: timestamp,
            content: editor.html.get(true),
        };
        if(!list.classList.contains('hidden')) {
            loadArticle();
        }
        GM_setValue('tempArticles', tempArticles);
        alert('작성 중인 게시물이 저장되었습니다.');
    });
    loadBtn.addEventListener('click', () => {
        if(list.classList.contains('hidden')) {
            loadArticle();

            list.classList.remove('hidden');
            setPosition();
        }
        else {
            list.classList.add('hidden');
        }
    });
    deleteBtn.addEventListener('click', event => {
        event.preventDefault();
        for(let i = tbody.childElementCount - 1; i >= 0; i -= 1) {
            const e = tbody.childNodes[i];
            if(e.querySelector('input[name="select"]').checked) {
                const id = e.querySelector('a').dataset.id;
                delete tempArticles[id];
                e.remove();
            }
        }
        GM_setValue('tempArticles', tempArticles);

        selectAll.checked = false;
        setPosition();
    });

    btns.insertAdjacentElement('afterend', list);
    btns.prepend(saveBtn);
    btns.prepend(loadBtn);
}
