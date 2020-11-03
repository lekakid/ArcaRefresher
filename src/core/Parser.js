export default {
    getArticles,
    getComments,
    getUserID,
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

function getUserID(infoElement) {
    if(!infoElement) {
        console.error('[Parser.getUserID] 올바르지 않은 부모 엘리먼트 사용');
        return null;
    }

    if(infoElement.dataset.id) {
        return infoElement.dataset.id;
    }

    let id = infoElement.children[0].title || infoElement.children[0].textContent;
    if(id.indexOf('#') > -1) {
        id = id.substring(id.indexOf('#'));
    }

    infoElement.dataset.id = id;
    return id;
}
