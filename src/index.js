import * as Setting from './module/Setting';
import * as HideSystem from './module/HideSystem';
import * as PreviewFilter from './module/PreviewFilter';
import * as ArticleContextMenu from './module/ArticleContextMenu';
import * as AdvancedReply from './module/AdvancedReply';
import * as BlockSystem from './module/BlockSystem';
import * as Refrehser from './module/Refresher';
import * as MyImage from './module/MyImage';
import * as AdvancedImageUpload from './module/AdvancedImageUpload';
import * as ShortCut from './module/ShortCut';
import * as IPScouter from './module/IPScouter';
import * as ImageDownloader from './module/ImageDownloader';
import * as UserMemo from './module/UserMemo';

import headerfix from './css/HeaderFix.css';
import fade from './css/Fade.css';
import hidesheet from './css/HideSystem.css';

let channel;

(function () {
    document.head.append(<style>{headerfix}</style>);
    document.head.append(<style>{fade}</style>);
    document.head.append(<style>{hidesheet}</style>);

    const path = location.pathname.split('/');

    channel = path[2] || '';
    window.config = Setting.load();
    Setting.setup(channel, window.config);

    HideSystem.apply();

    if(path[1] != 'b') return;

    if(path[3] == undefined || path[3] == '') {
        // Board Page
        initBoard();
    }
    else if(path[3] == 'write') {
        // Write Article Page
        initWrite();
    }
    else if(/[0-9]+/.test(path[3])) {
        if(path[4] == 'edit') {
            // Edit Article Page
            initWrite();
        }
        else {
            // Article View Page
            initArticle();
        }
    }
}());

function initBoard() {
    const board = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    const articles = board.querySelectorAll('a.vrow:not(.notice)');

    Refrehser.run(channel);
    ShortCut.apply('board');

    HideSystem.applyNotice();

    PreviewFilter.filter(articles, channel);

    UserMemo.apply();
    IPScouter.applyArticles(articles);
    BlockSystem.blockArticle(articles);
}

function initArticle() {
    const comments = document.querySelectorAll('.list-area .comment-item');
    const board = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    const articles = board.querySelectorAll('a.vrow:not(.notice)');

    ShortCut.apply('article');

    HideSystem.applyNotice();

    UserMemo.applyArticle();
    IPScouter.applyAuthor();

    ArticleContextMenu.apply();
    ImageDownloader.apply();

    IPScouter.applyComments(comments);
    BlockSystem.blockComment(comments);
    BlockSystem.blockEmoticon(comments);
    AdvancedReply.applyRefreshBtn();
    AdvancedReply.applyEmoticonBlockBtn();
    AdvancedReply.applyFullAreaRereply();

    PreviewFilter.filter(articles, channel);

    UserMemo.apply();
    IPScouter.applyArticles(articles);
    BlockSystem.blockArticle(articles);
}

function initWrite() {
    MyImage.apply();
    AdvancedImageUpload.apply();
}
