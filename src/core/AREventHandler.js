const onModifyArticleCallback = [];
const onModifyCommentCallback = [];

export default function initialize() {
  document.addEventListener('ar_article', () => {
    for (const { callback } of onModifyArticleCallback) {
      callback();
    }
  });

  document.addEventListener('ar_comment', () => {
    for (const { callback } of onModifyCommentCallback) {
      callback();
    }
  });
}

export function addOnModifyArticle(callbackObject) {
  onModifyArticleCallback.push(callbackObject);
  onModifyArticleCallback.sort((a, b) => a.priority - b.priority);
}

export function addOnModifyComment(callbackObject) {
  onModifyCommentCallback.push(callbackObject);
  onModifyCommentCallback.sort((a, b) => a.priority - b.priority);
}
