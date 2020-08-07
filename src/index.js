import * as Setting from './module/setting';
import * as HideNotice from './module/hidenotice';
import * as HideAvatar from './module/hideavatar';
import * as HideModified from './module/hidemodified';
import * as PreviewFilter from './module/previewfilter';
import * as ArticleContextMenu from './module/articlecontextmenu';
import * as AdvancedReply from './module/AdvancedReply';
import * as BlockSystem from './module/blocksystem';
import * as Refrehser from './module/refresher';
import * as MyImage from './module/myimage';
import * as AdvancedImageUpload from './module/advancedimageupload';

import headerfix from './css/headerfix.css';
import fade from './css/fade.css';

(async function () {
    document.head.append(<style>{headerfix}</style>);
    document.head.append(<style>{fade}</style>);

    const path = location.pathname.split('/');

    if(path[1] != 'b') return;

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
}());

function initBoard() {
    HideNotice.apply();

    const board = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    const articles = board.querySelectorAll('a[class="vrow"]');
    PreviewFilter.filter(articles);
    BlockSystem.blockArticle(articles);

    Refrehser.run();
}

function initArticle() {
    AdvancedReply.applyRefreshBtn();
    AdvancedReply.applyBlockBtn();
    HideAvatar.apply();
    ArticleContextMenu.apply();
    HideModified.apply();

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
