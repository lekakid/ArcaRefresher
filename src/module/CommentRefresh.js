import { COMMENT_SUBTITLE } from '../core/ArcaSelector';
import { dispatchAREvent } from '../core/AREventHandler';
import { waitForElement } from '../core/LoadManager';
import { getDateStr } from '../util/DateManager';

export default { load };

async function load() {
  try {
    if (await waitForElement(COMMENT_SUBTITLE)) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function apply() {
  const commentArea = document.querySelector('#comment');
  if (!commentArea || commentArea.querySelector('.alert')) {
    // 댓글 작성 권한 없음
    return;
  }

  const btn = (
    <button className="btn btn-arca" style={{ marginLeft: '1rem' }}>
      <span className="icon ion-android-refresh" />
      <span> 새로고침</span>
    </button>
  );
  const clonebtn = btn.cloneNode(true);

  commentArea.querySelector('.title a').insertAdjacentElement('beforebegin', btn);
  commentArea.querySelector('.subtitle').append(clonebtn);

  async function onClick(event) {
    event.preventDefault();
    btn.disabled = true;
    clonebtn.disabled = true;

    const response = await getRefreshData();
    const newComments = response.querySelector('#comment .list-area');
    try {
      commentArea.querySelector('.list-area').remove();
    } catch {
      // eslint-disable-next-line no-empty
    }

    if (newComments) {
      newComments.querySelectorAll('time').forEach((time) => {
        time.textContent = getDateStr(time.dateTime);
      });
      commentArea.querySelector('.title').insertAdjacentElement('afterend', newComments);

      dispatchAREvent('CommentChange');
    }

    btn.disabled = false;
    clonebtn.disabled = false;
  }

  btn.addEventListener('click', onClick);
  clonebtn.addEventListener('click', onClick);
}

function getRefreshData() {
  return new Promise((resolve) => {
    const req = new XMLHttpRequest();

    req.open('GET', window.location.href);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      resolve(req.response);
    });
    req.send();
  });
}
