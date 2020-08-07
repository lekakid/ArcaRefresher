import * as Setting from './module/setting.js';
import * as HideNotice from './module/hidenotice.js';
import * as HideAvatar from './module/hideavatar.js';
import * as PreviewFilter from './module/previewfilter.js';
import * as ReplyRefreshBtn from './module/replyrefreshbtn.js';
import * as BlockSystem from './module/blocksystem.js';

import headerfix from './css/headerfix.css';
import fade from './css/fade.css';

(async function() {
    document.head.append(<style>{headerfix}</style>);
    document.head.append(<style>{fade}</style>);
    
    const path = location.pathname.split('/');

    if(path[1] != 'b')
        return;

    window.channel = path[2] || '';
    window.setting = await Setting.load(window.channel);
    Setting.setup(window.channel);

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
})();

function initBoard() {
    HideNotice.apply();

    const board = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    const articles = board.querySelectorAll('a[class="vrow"]');
    PreviewFilter.filter(articles);
    BlockSystem.blockArticle(articles);
    
    // TODO : Refresher
}

function initArticle() {
    ReplyRefreshBtn.apply();
    HideAvatar.apply();
    // TODO : Add Image Context Menu

    const comments = document.querySelectorAll('.list-area .comment-item');
    BlockSystem.blockComment(comments);
}

function initWrite(editMode) {
    if(!editMode) {
        // TODO : My Image Feature
    }

    // TODO : Advanced Image Uploader
}