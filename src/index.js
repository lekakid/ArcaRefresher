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

import { stylesheet as ipsheet } from './css/IPScouter.module.css';

(async function () {
    document.head.append(<style>{headerfix}</style>);
    document.head.append(<style>{fade}</style>);
    document.head.append(<style>{hidesheet}</style>);
    document.head.append(<style>{ipsheet}</style>);

    const path = location.pathname.split('/');
    const channel = path[2] || '';

    if(document.querySelector('footer') == null) {
        await new Promise(resolve => {
            const observer = new MutationObserver(mutations => {
                for(const m of mutations) {
                    if(m.target.nodeName == 'FOOTER') {
                        observer.disconnect();
                        resolve();
                        return;
                    }
                }
            });
            observer.observe(document, {
                childList: true,
                subtree: true,
            });
        });
    }

    window.config = Setting.load();
    Setting.setup(channel, window.config);

    HideSystem.apply();

    let targetElement = document.querySelector('article > .article-view, article > .board-article-list, article > .article-write');
    if(targetElement == null) return;

    UserMemo.apply();

    let type = '';

    if(targetElement.classList.contains('article-view')) type = 'article';
    if(targetElement.classList.contains('board-article-list')) type = 'board';
    if(targetElement.classList.contains('article-write')) type = 'write';

    if(type == 'article') {
        UserMemo.applyHandler();
        IPScouter.applyAuthor();

        ArticleContextMenu.apply();
        ImageDownloader.apply();

        const comments = targetElement.querySelectorAll('#comment .comment-item');
        IPScouter.applyComments(comments);
        BlockSystem.blockComment(comments);
        BlockSystem.blockEmoticon(comments);

        AdvancedReply.applyRefreshBtn();
        AdvancedReply.applyEmoticonBlockBtn();
        AdvancedReply.applyFullAreaRereply();

        ShortCut.apply('article');

        targetElement = targetElement.querySelector('.included-article-list');
        type = 'board-included';
    }

    if(type.indexOf('board') > -1) {
        HideSystem.applyNotice();

        const articles = targetElement.querySelectorAll('.list-table a.vrow');
        PreviewFilter.filter(articles, channel);
        IPScouter.applyArticles(articles);
        BlockSystem.blockArticle(articles);

        if(type != 'board-included') {
            Refrehser.run(channel);
            ShortCut.apply('board');
        }
    }

    if(type == 'write') {
        MyImage.apply();
        AdvancedImageUpload.apply();
    }
}());
