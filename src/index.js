import * as Setting from './module/Setting';
import * as HideSystem from './module/HideSystem';
import * as PreviewFilter from './module/PreviewFilter';
import * as ArticleContextMenu from './module/ArticleContextMenu';
import * as AdvancedReply from './module/AdvancedReply';
import * as BlockSystem from './module/BlockSystem';
import * as Refrehser from './module/Refresher';
import * as MyImage from './module/MyImage';
import * as AdvancedImageUpload from './module/AdvancedImageUpload';

import headerfix from './css/HeaderFix.css';
import fade from './css/Fade.css';

let channel;

(async function () {
    document.head.append(<style>{headerfix}</style>);
    document.head.append(<style>{fade}</style>);

    const path = location.pathname.split('/');

    if(path[1] != 'b') return;

    channel = path[2] || '';
    window.config = await Setting.load(channel);
    Setting.setup(channel, window.config);

    if(path[3] == undefined || path[3] == '') {
        // Board Page
        initBoard();
    }
    else if(path[3] == 'write') {
        // Write Article Page
        initWrite(false);
    }
    else if(/[0-9]+/.test(path[3])) {
        if(path[4] == 'edit') {
            // Edit Article Page
            initWrite(true);
        }
        else {
            // Article View Page
            initArticle();
            initBoard();
        }
    }
}());

function initBoard() {
    HideSystem.applyNotice();

    const board = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    const articles = board.querySelectorAll('a[class="vrow"]');
    PreviewFilter.filter(articles, channel);
    BlockSystem.blockArticle(articles);

    Refrehser.run(channel);
}

function initArticle() {
    AdvancedReply.applyRefreshBtn();
    AdvancedReply.applyBlockBtn();
    HideSystem.applyAvatar();
    HideSystem.applyMedia();
    ArticleContextMenu.apply();
    HideSystem.applyModified();

    const comments = document.querySelectorAll('.list-area .comment-item');
    BlockSystem.blockComment(comments);
    BlockSystem.blockEmoticon(comments);
}

function initWrite(editMode) {
    if(!editMode) {
        MyImage.apply();
    }

    AdvancedImageUpload.apply();
}
