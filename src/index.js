import * as Setting from './module/Setting';
import * as HideSystem from './module/HideSystem';
import * as PreviewFilter from './module/PreviewFilter';
import * as ArticleContextMenu from './module/ArticleContextMenu';
import * as AdvancedReply from './module/AdvancedReply';
import * as BlockSystem from './module/BlockSystem';
import * as Refrehser from './module/Refresher';
import * as AdvancedWriteForm from './module/AdvancedWriteForm';
import * as ShortCut from './module/ShortCut';
import * as IPScouter from './module/IPScouter';
import * as ImageDownloader from './module/ImageDownloader';
import * as UserMemo from './module/UserMemo';
import * as CategoryColor from './module/CategoryColor';
import { waitForElement } from './module/ElementDetector';

import headerfix from './css/HeaderFix.css';
import fade from './css/Fade.css';
import hidesheet from './css/HideSystem.css';
import blocksheet from './css/BlockSystem.css';

import { stylesheet as ipsheet } from './css/IPScouter.module.css';

(async function () {
    document.head.append(<style>{headerfix}</style>);
    document.head.append(<style>{fade}</style>);
    document.head.append(<style>{hidesheet}</style>);
    document.head.append(<style>{blocksheet}</style>);
    document.head.append(<style>{ipsheet}</style>);

    const path = location.pathname.split('/');
    const channel = path[2] || '';

    await waitForElement('.content-wrapper');

    const oldData = GM_getValue('Setting');
    if(oldData != undefined) {
        Setting.importConfig(oldData);
        GM_deleteValue('Setting');
    }
    Setting.setup(channel);

    HideSystem.apply();

    await waitForElement('footer');

    let targetElement = document.querySelector('article > .article-view, article > div.board-article-list, article > .article-write');
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
        BlockSystem.blockRatedown();
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
        Setting.setupCategory(channel);

        const articles = targetElement.querySelectorAll('.list-table a.vrow');
        CategoryColor.applyArticles(articles, channel);
        BlockSystem.blockArticle(articles, channel);
        PreviewFilter.filter(articles, channel);
        IPScouter.applyArticles(articles);

        if(type != 'board-included') {
            Refrehser.run(channel);
            ShortCut.apply('board');
        }
    }

    if(type == 'write') {
        await waitForElement('.fr-box');
        const editor = unsafeWindow.FroalaEditor('#content');
        AdvancedWriteForm.applyClipboardUpload(editor);
        AdvancedWriteForm.applyMyImage(editor);
    }
}());
