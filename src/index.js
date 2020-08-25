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

    const articleList = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    const articleArea = document.querySelector('.article-wrapper');
    const writeArea = document.querySelector('.article-write');

    let shortCutMode = '';
    UserMemo.apply();

    if(articleArea) {
        const comments = document.querySelectorAll('#comment .comment-item');
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

        shortCutMode = 'article';
    }
    if(articleList) {
        const articles = articleList.querySelectorAll('a.vrow:not(.notice)');

        HideSystem.applyNotice();

        PreviewFilter.filter(articles, channel);

        IPScouter.applyArticles(articles);
        BlockSystem.blockArticle(articles);

        if(articleArea == null) {
            Refrehser.run(channel);
            shortCutMode = 'board';
        }
    }
    if(writeArea) {
        MyImage.apply();
        AdvancedImageUpload.apply();
    }

    ShortCut.apply(shortCutMode);
}());
