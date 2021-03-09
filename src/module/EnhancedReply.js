import { addSetting, getValue, setValue } from '../core/Configure';
import { CurrentPage } from '../core/Parser';

export default { load };

const FORCE_OPEN_COMMENT = { key: 'forceOpenComment', defaultValue: false };

function load() {
  try {
    setupSetting();

    if (CurrentPage.Component.Comment) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const forceOpenComment = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );

  addSetting({
    header: '댓글창 관련',
    group: [
      {
        title: '접힌 댓글 바로 펼쳐보기',
        content: forceOpenComment,
      },
    ],
    valueCallback: {
      save() {
        setValue(FORCE_OPEN_COMMENT, forceOpenComment.value === 'true');
      },
      load() {
        forceOpenComment.value = getValue(FORCE_OPEN_COMMENT);
      },
    },
  });
}

function apply() {
  const commentArea = document.querySelector('#comment');
  commentArea.addEventListener('click', (event) => {
    if (event.target.closest('form')) return;

    const element = event.target.closest('a, .emoticon, .btn-more, .message');
    if (element == null) return;
    if (!element.classList.contains('message')) return;

    event.preventDefault();

    element.parentNode.querySelector('.reply-link').click();
  });

  const forceOpenComment = getValue(FORCE_OPEN_COMMENT);
  if (forceOpenComment) {
    const foldedReplyList = document.querySelectorAll('#comment .btn-more');
    foldedReplyList.forEach((e) => {
      e.style.display = 'none';
      e.closest('.message').style.maxHeight = 'none';
    });
  }
}
