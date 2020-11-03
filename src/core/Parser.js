export default {
    getArticles,
    getComments,
};

function getArticles(rootView) {
    if(!rootView || !rootView.closest('.list-table')) {
        console.error('[Parser.getArticles] 올바르지 않은 부모 엘리먼트 사용');
        return null;
    }

    return rootView.querySelectorAll('a.vrow:not(.notice-unfilter)');
}

function getComments(rootView) {
    if(!rootView || !rootView.closest('#comment')) {
        console.error('[Parser.getComments] 올바르지 않은 부모 엘리먼트 사용');
        return null;
    }

    return rootView.querySelectorAll('.comment-item');
}
