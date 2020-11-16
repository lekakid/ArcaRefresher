export default {
    initialize,
    getChannelID,
    getCurrentState,
    hasArticle,
    hasBoard,
    hasComment,
    hasWriteView,
    getArticleView,
    getBoardView,
    getCommentView,
    getWriteView,
    getArticles,
    getComments,
    getUserInfo,
    getUserID,
};

let articleView = null;
let boardView = null;
let commentView = null;
let writeView = null;

let currentChannel = '';
let currentState = '';

function initialize() {
    const path = location.pathname.split('/');
    currentChannel = path[2] || '';

    const articleElement = document.querySelector('article');
    articleView = articleElement.querySelector('.article-wrapper');
    commentView = articleElement.querySelector('#comment');
    boardView = articleElement.querySelector('div.board-article-list .list-table, div.included-article-list .list-table');
    writeView = articleElement.querySelector('.article-write');

    if(articleView) {
        currentState = 'article';
    }
    else if(boardView) {
        currentState = 'board';
    }
    else if(writeView) {
        currentState = 'write';
    }
}

function getChannelID() {
    return currentChannel;
}

function getCurrentState() {
    return currentState;
}

function hasArticle() {
    return !!articleView;
}

function hasBoard() {
    return !!boardView;
}

function hasComment() {
    return !!commentView;
}

function hasWriteView() {
    return !!writeView;
}

function getArticleView() {
    return articleView;
}

function getBoardView() {
    return boardView;
}

function getCommentView() {
    return commentView;
}

function getWriteView() {
    return writeView;
}

function getArticles(rootView) {
    if(!rootView) rootView = boardView;
    return rootView.querySelectorAll('a.vrow:not(.notice-unfilter)');
}

function getComments() {
    return commentView.querySelectorAll('.comment-item');
}

function getUserInfo(infoElement) {
    if(!infoElement) {
        console.error('[Parser.getUserInfo] 올바르지 않은 부모 엘리먼트 사용');
        return null;
    }

    if(infoElement.dataset.info) {
        return infoElement.dataset.info;
    }

    let id = infoElement.children[0].title || infoElement.children[0].textContent;
    if(/\([0-9]*\.[0-9]*\)/.test(id)) {
        id = infoElement.childNodes[0].textContent + id;
    }

    infoElement.dataset.info = id;
    return id;
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
