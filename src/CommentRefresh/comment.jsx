import { getDateStr } from '../$Common/DateHandler';
import { COMMENT_INNER_VIEW } from '../$Common/Selector';

export default function getNewComment() {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.open('GET', window.location.href);
    req.responseType = 'document';
    req.timeout = 2000;
    req.addEventListener('load', () => {
      try {
        const { response } = req;
        const newComments = response.querySelector(COMMENT_INNER_VIEW);
        newComments.querySelectorAll('time').forEach((time) => {
          // eslint-disable-next-line no-param-reassign
          time.textContent = getDateStr(
            time.dateTime,
            'year-month-day hh:mm:ss',
          );
        });

        resolve(newComments);
      } catch (error) {
        reject(error);
      }
    });
    req.timeout = () => {
      reject(new Error('[CommentRefresh] 연결 시간 초과'));
    };
    req.onerror = () => {
      reject(new Error('[CommentRefresh] 연결 거부'));
    };
    req.send();
  });
}
