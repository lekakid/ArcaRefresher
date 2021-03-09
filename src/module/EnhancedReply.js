import { addSetting, getValue, setValue } from '../core/Configure';
import { CurrentPage } from '../core/Parser';

export default { load };

const WIDE_AREA = { key: 'wideCommentArea', defaultValue: true };
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
  const wideCommentArea = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
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
        title: '댓글을 클릭하면 답글창이 바로 열리게 하기',
        content: wideCommentArea,
      },
      {
        title: '접힌 댓글 바로 펼쳐보기',
        content: forceOpenComment,
      },
    ],
    valueCallback: {
      save() {
        setValue(WIDE_AREA, wideCommentArea.value === 'true');
        setValue(FORCE_OPEN_COMMENT, forceOpenComment.value === 'true');
      },
      load() {
        forceOpenComment.value = getValue(FORCE_OPEN_COMMENT);
        wideCommentArea.value = getValue(WIDE_AREA);
      },
    },
  });
}

function apply() {
  const wideCommentArea = getValue(WIDE_AREA);
  if (wideCommentArea) {
    const commentArea = document.querySelector('#comment');
    commentArea.addEventListener('click', (event) => {
      if (event.target.closest('form')) return;

      const element = event.target.closest('a, .emoticon, .btn-more, .message');
      if (element == null) return;
      if (!element.classList.contains('message')) return;

      event.preventDefault();

      element.parentNode.querySelector('.reply-link').click();
    });
  }

  const forceOpenComment = getValue(FORCE_OPEN_COMMENT);
  if (forceOpenComment) {
    const foldedReplyList = document.querySelectorAll('#comment .btn-more');
    foldedReplyList.forEach((e) => {
      e.style.display = 'none';
      e.closest('.message').style.maxHeight = 'none';
    });
  }
}
