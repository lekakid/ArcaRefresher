import { addSetting, getValue, setValue } from '../core/Configure';
import { getDateStr } from '../util/DateManager';
import { waitForElement } from '../util/ElementDetector';

import stylesheet from '../css/TemporaryArticle.css';

export default { load };

const TEMPORARY_ARTICLES = { key: 'tempArticles', defaultValue: {} };
const INCLUDE_TITLE = { key: 'includeTitle', defaultValue: 'include' };

async function load() {
  try {
    setupSetting();
    await waitForElement('.fr-box');
    apply();
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const includeTitle = (
    <select>
      <option value="include">제목을 포함</option>
      <option value="confirm">매번 묻기</option>
      <option value="exclude">제목을 제외</option>
    </select>
  );

  addSetting({
    header: '게시물 임시 저장',
    group: [
      {
        title: '불러올 때 게시물 제목 처리',
        content: includeTitle,
      },
    ],
    valueCallback: {
      save() {
        setValue(INCLUDE_TITLE, includeTitle.value);
      },
      load() {
        includeTitle.value = getValue(INCLUDE_TITLE);
      },
    },
  });
}

function apply() {
  const editor = unsafeWindow.FroalaEditor('#content');
  const tempArticles = getValue(TEMPORARY_ARTICLES);
  const includeTitle = getValue(INCLUDE_TITLE);

  const selectAll = <input type="checkbox" name="selectAll" />;
  const deleteBtn = (
    <button className="btn btn-danger" id="tempDeleteBtn">
      삭제
    </button>
  );
  const closeBtn = (
    <button className="btn btn-arca" id="tempCloseBtn">
      닫기
    </button>
  );
  const list = <tbody />;
  const wrapper = (
    <div className="hidden" id="tempArticleWrapper">
      <style>{stylesheet}</style>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>{selectAll}</th>
            <th>제목</th>
            <th>시간</th>
          </tr>
        </thead>
        {list}
        <tfoot>
          <td colSpan="3" style={{ textAlign: 'center' }}>
            {deleteBtn}
            {closeBtn}
          </td>
        </tfoot>
      </table>
    </div>
  );

  function loadArticle() {
    selectAll.checked = false;

    while (list.firstChild) list.lastChild.remove();
    for (const key of Object.keys(tempArticles)) {
      list.append(
        <tr data-id={key}>
          <td>
            <input type="checkbox" name="select" />
          </td>
          <td>
            <a href="#">{tempArticles[key].title}</a>
          </td>
          <td>{getDateStr(tempArticles[key].time).split(' ')[0]}</td>
        </tr>
      );
    }
  }

  wrapper.addEventListener('click', (event) => {
    if (event.target.name === 'selectAll') {
      list.querySelectorAll('input[name="select"]').forEach((e) => {
        e.checked = event.target.checked;
      });
    }

    if (event.target.tagName === 'A') {
      const row = event.target.closest('tr');
      const id = row.dataset.id;
      const title = document.querySelector('#inputTitle');
      if (
        includeTitle === 'include' ||
        // eslint-disable-next-line no-restricted-globals
        (includeTitle === 'confirm' && confirm('게시물 제목을 저장한 제목으로 변경하시겠습니까?'))
      ) {
        title.value = tempArticles[id].title;
      }
      editor.html.set(tempArticles[id].content);
      wrapper.classList.add('hidden');
    }

    if (!event.target.closest('table')) {
      wrapper.classList.add('hidden');
    }
  });
  deleteBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const checkedItems = list.querySelectorAll('input[name="select"]:checked');
    checkedItems.forEach((i) => {
      const row = i.closest('tr');
      const id = row.dataset.id;
      delete tempArticles[id];
    });

    setValue(TEMPORARY_ARTICLES, tempArticles);
    loadArticle();
  });
  closeBtn.addEventListener('click', (event) => {
    event.preventDefault();

    wrapper.classList.add('hidden');
  });

  const btns = document.querySelector('.btns');
  const saveBtn = (
    <button className="btn btn-primary" id="tempSaveBtn">
      임시 저장
    </button>
  );
  const loadBtn = (
    <button className="btn btn-arca" id="tempLoadBtn">
      불러오기
    </button>
  );
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
    </>
  );

  saveBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const timestamp = new Date().getTime();

    const title = document.querySelector('#inputTitle').value;

    tempArticles[timestamp] = {
      title: title || '제목 없음',
      time: timestamp,
      content: editor.html.get(true),
    };
    if (!wrapper.classList.contains('hidden')) {
      loadArticle();
    }
    setValue(TEMPORARY_ARTICLES, tempArticles);
    alert('작성 중인 게시물이 저장되었습니다.');
  });
  loadBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (wrapper.classList.contains('hidden')) {
      loadArticle();

      wrapper.classList.remove('hidden');
    }
  });
}
