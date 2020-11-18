export default {
    initialize,
    getChannelInfo,
    getArticleInfo,
    getCurrentState,
    hasArticle,
    hasBoard,
    hasComment,
    hasWriteView,
    queryView,
    queryItems,
    parseUserInfo,
    parseUserID,
};

let articleView = null;
let boardView = null;
let commentView = null;
let writeView = null;

let currentChannel = '';
let currentChannelID = '';
let currentState = '';

let currentArticleTitle = '';
let currentArticleCategory = '';
let currentArticleAuthor = '';
let currentArticleAuthorID = '';

function initialize() {
    const articleElement = document.querySelector('article');
    articleView = articleElement.querySelector('.article-wrapper');
    commentView = articleElement.querySelector('#comment');
    boardView = articleElement.querySelector('div.board-article-list .list-table, div.included-article-list .list-table');
    writeView = articleElement.querySelector('.article-write');

    if(boardView) {
        currentChannel = articleElement.querySelector('.board-title a:not([class])').textContent;
        currentChannelID = location.pathname.split('/')[2];
    }

    if(articleView) {
        currentState = 'article';

        const titleElement = articleView.querySelector('.article-head .title');
        const categoryElement = articleView.querySelector('.article-head .badge');
        const authorElement = articleView.querySelector('.article-head .user-info');

        currentArticleTitle = (titleElement) ? titleElement.lastChild.textContent.trim() : '';
        currentArticleCategory = (categoryElement) ? categoryElement.textContent : '';
        currentArticleAuthor = (authorElement) ? parseUserInfo(authorElement) : '';
        currentArticleAuthorID = (authorElement) ? parseUserID(authorElement) : '';
    }
    else if(boardView) {
        currentState = 'board';
    }
    else if(writeView) {
        currentState = 'write';
    }
}

function getCurrentState() {
    return currentState;
}

function getChannelInfo() {
    return {
        id: currentChannelID,
        name: currentChannel,
    };
}

function getArticleInfo() {
    if(!articleView) {
        console.error('[Parser.getArticleInfo] 게시물 확인 불가');
        return;
    }

    return {
        title: currentArticleTitle,
        category: currentArticleCategory,
        author: currentArticleAuthor,
        authorID: currentArticleAuthorID,
    };
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

function queryView(query) {
    switch(query) {
    case 'article':
        return articleView;
    case 'board':
        return boardView;
    case 'comment':
        return commentView;
    case 'write':
        return writeView;
    default:
        return document;
    }
}

function queryItems(query, viewQuery, viewElement) {
    const view = viewElement || queryView(viewQuery);

    switch(query) {
    case 'articles':
        return view.querySelectorAll('a.vrow:not(.notice-unfilter)');
    case 'comments':
        return view.querySelectorAll('.comment-item');
    case 'emoticons':
        return view.querySelectorAll('.emoticon');
    case 'users':
        return view.querySelectorAll('.user-info');
    case 'avatars':
        return view.querySelectorAll('.avatar');
    case 'ips':
        return view.querySelectorAll('.user-info small');
    default:
        return null;
    }
}

function parseUserInfo(infoElement) {
    if(!infoElement) {
        console.error('[Parser.parseUserInfo] 올바르지 않은 부모 엘리먼트 사용');
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

function parseUserID(infoElement) {
    if(!infoElement) {
        console.error('[Parser.parseUserID] 올바르지 않은 부모 엘리먼트 사용');
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
