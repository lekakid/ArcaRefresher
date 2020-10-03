import PostProcessor from './core/PostProcessor';
import Setting from './core/Setting';
import DefaultConfig from './core/DefaultConfig';

import AutoRefresher from './module/AutoRefresher';
import AutoRemover from './module/AutoRemover';
import BlockSystem from './module/BlockSystem';
import CategoryColor from './module/CategoryColor';
import ClipboardUpload from './module/ClipboardUpload';
import CommentRefresh from './module/CommentRefresh';
import ContextMenu from './module/ContextMenu';
import EmoticonBlock from './module/EmoticonBlock';
import FullAreaReply from './module/FullAreaReply';
import IPScouter from './module/IPScouter';
import ImageDownloader from './module/ImageDownloader';
import LiveModifier from './module/LiveModifier';
import MyImage from './module/MyImage';
import NotificationIconColor from './module/NotificationIconColor';
import ShortCut from './module/ShortCut';
import UserMemo from './module/UserMemo';

import { waitForElement } from './util/ElementDetector';

(async function () {
    PostProcessor.addGlobalStyle();

    const path = location.pathname.split('/');
    const channel = path[2] || '';

    await waitForElement('.content-wrapper');
    Setting.setup(channel);

    LiveModifier.apply();
    NotificationIconColor.apply();

    await waitForElement('footer');

    let targetElement = document.querySelector('article > .article-view, article > div.board-article-list .list-table, article > .article-write');
    if (targetElement == null) return;

    let type = '';

    if (targetElement.classList.contains('article-view')) type = 'article';
    if (targetElement.classList.contains('list-table')) type = 'board';
    if (targetElement.classList.contains('article-write')) type = 'write';

    if (type == 'article') {
        try {
            const articleWrapper = targetElement.querySelector('.article-wrapper');
            PostProcessor.parseUserInfo(articleWrapper);
            UserMemo.apply(articleWrapper);
            UserMemo.setHandler(articleWrapper);
            IPScouter.apply(articleWrapper);

            LiveModifier.applyImageResize();
            ContextMenu.apply(articleWrapper);
            BlockSystem.blockRatedown();
            ImageDownloader.apply();

            const commentView = targetElement.querySelector('#comment');
            if (commentView) {
                const comments = commentView.querySelectorAll('.comment-item');
                BlockSystem.blockComment(comments);
                BlockSystem.blockEmoticon(comments);

                CommentRefresh.apply(commentView);
                EmoticonBlock.apply(commentView);
                FullAreaReply.apply(commentView);

                commentView.addEventListener('ar_refresh', () => {
                    PostProcessor.parseUserInfo(commentView);
                    UserMemo.apply(commentView);
                    IPScouter.apply(commentView);

                    BlockSystem.blockComment(comments);
                    BlockSystem.blockEmoticon(comments);
                    EmoticonBlock.apply(commentView);
                });
            }
        }
        catch (error) {
            console.warn('게시물 처리 중 오류 발생');
            console.error(error);
        }

        ShortCut.apply('article');

        targetElement = targetElement.querySelector('.included-article-list .list-table');
        if (targetElement) type = 'board-included';
    }

    if (type.indexOf('board') > -1) {
        Setting.setupCategory(channel);

        PostProcessor.parseUserInfo(targetElement);
        UserMemo.apply(targetElement);
        IPScouter.apply(targetElement);

        let articles = targetElement.querySelectorAll('a.vrow');
        CategoryColor.apply(articles, channel);
        BlockSystem.blockPreview(articles, channel);
        BlockSystem.blockArticle(targetElement, articles, channel);

        targetElement.addEventListener('ar_refresh', () => {
            PostProcessor.parseUserInfo(targetElement);
            UserMemo.apply(targetElement);
            IPScouter.apply(targetElement);

            articles = targetElement.querySelectorAll('a.vrow');
            CategoryColor.apply(articles, channel);
            BlockSystem.blockPreview(articles, channel);
            BlockSystem.blockArticle(targetElement, articles, channel);
            AutoRemover.removeArticle(articles);
        });

        if (type != 'board-included') {
            const refreshTime = GM_getValue('refreshTime', DefaultConfig.refreshTime);
            if (refreshTime) {
                const refresher = new AutoRefresher(targetElement, refreshTime);
                refresher.start();
            }
            ShortCut.apply('board');
        }
    }

    if (type == 'write') {
        await waitForElement('.fr-box');
        const editor = unsafeWindow.FroalaEditor('#content');
        ClipboardUpload.apply(editor);
        MyImage.apply(editor);
    }
}());
