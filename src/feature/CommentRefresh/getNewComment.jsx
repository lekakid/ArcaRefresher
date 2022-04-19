import { COMMENT_VIEW } from 'core/selector';

export default async function getNewComment() {
  try {
    const response = await fetch(window.location.href);
    if (!response.ok) throw new Error('네트워크 오류');

    const text = await response.text();
    const parser = new DOMParser();
    const resultDocument = parser.parseFromString(text, 'text/html');
    const newComments = resultDocument.querySelector(COMMENT_VIEW);

    return newComments;
  } catch (error) {
    console.warn('[CommentRefresh/getNewCommment]', error);
    return null;
  }
}
