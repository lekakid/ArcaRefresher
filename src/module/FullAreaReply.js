import { CurrentPage } from '../core/Parser';

export default { load };

function load() {
  try {
    if (CurrentPage.Component.Comment) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
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
}
