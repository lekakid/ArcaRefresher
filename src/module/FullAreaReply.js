export default { apply };

function apply(commentArea) {
    commentArea.addEventListener('click', event => {
        if(event.target.closest('form')) return;

        const element = event.target.closest('a, .emoticon, .btn-more, .message');
        if(element == null) return;
        if(!element.classList.contains('message')) return;

        event.preventDefault();

        element.parentNode.querySelector('.reply-link').click();
    });
}
