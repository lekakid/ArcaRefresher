import * as Setting from './module/Setting';
import LiveModifier from './module/LiveModifier';
import ContextMenu from './module/ContextMenu';
import BlockSystem from './module/BlockSystem';
import AutoRefresher from './module/AutoRefresher';
import MyImage from './module/MyImage';
import ShortCut from './module/ShortCut';
import IPScouter from './module/IPScouter';
import ImageDownloader from './module/ImageDownloader';
import UserMemo from './module/UserMemo';
import CategoryColor from './module/CategoryColor';
import AutoRemover from './module/AutoRemover';
import { waitForElement } from './util/ElementDetector';

import EmoticonBlock from './module/EmoticonBlock';
import FullAreaReply from './module/FullAreaReply';
import CommentRefresh from './module/CommentRefresh';
import ClipboardUpload from './module/ClipboardUpload';

import PostProcessor from './core/PostProcessor';

import fade from './css/Fade.css';
import blocksheet from './css/BlockSystem.css';

import { stylesheet as ipsheet } from './css/IPScouter.module.css';

(async function () {
    document.head.append(<style>{fade}</style>);
    document.head.append(<style>{blocksheet}</style>);
    document.head.append(<style>{ipsheet}</style>);

    const path = location.pathname.split('/');
    const channel = path[2] || '';

    await waitForElement('.content-wrapper');
    Setting.setup(channel);

    LiveModifier.apply();

    await waitForElement('footer');

    let targetElement = document.querySelector('article > .article-view, article > div.board-article-list .list-table, article > .article-write');
    if(targetElement == null) return;

    let type = '';

    if(targetElement.classList.contains('article-view')) type = 'article';
    if(targetElement.classList.contains('list-table')) type = 'board';
    if(targetElement.classList.contains('article-write')) type = 'write';

    if(type == 'article') {
        try {
            PostProcessor.parseUserInfo(targetElement);
            UserMemo.apply(targetElement);
            UserMemo.setHandler(targetElement);
            IPScouter.apply(targetElement);

            ContextMenu.apply(targetElement);
            BlockSystem.blockRatedown();
            ImageDownloader.apply();

            const commentView = targetElement.querySelector('#comment');
            if(commentView) {
                const comments = commentView.querySelectorAll('.comment-item');
                BlockSystem.blockComment(comments);
                BlockSystem.blockEmoticon(comments);

                CommentRefresh.apply(commentView);
                EmoticonBlock.apply(commentView);
                FullAreaReply.apply(commentView);

                const commentObserver = new MutationObserver(() => {
                    PostProcessor.parseUserInfo(commentView);
                    UserMemo.apply(commentView);
                    IPScouter.apply(commentView);

                    BlockSystem.blockComment(comments);
                    BlockSystem.blockEmoticon(comments);
                    EmoticonBlock.apply(commentView);
                });
                commentObserver.observe(commentView, { childList: true });
            }
        }
        catch (error) {
            console.warn('게시물 처리 중 오류 발생');
            console.error(error);
        }

        ShortCut.apply('article');

        targetElement = targetElement.querySelector('.included-article-list .list-table');
        if(targetElement) type = 'board-included';
    }

    if(type.indexOf('board') > -1) {
        Setting.setupCategory(channel);

        PostProcessor.parseUserInfo(targetElement);
        UserMemo.apply(targetElement);
        IPScouter.apply(targetElement);

        let articles = targetElement.querySelectorAll('a.vrow');
        CategoryColor.apply(articles, channel);
        BlockSystem.blockPreview(articles, channel);
        BlockSystem.blockArticle(targetElement, articles, channel);

        const boardObserver = new MutationObserver(() => {
            boardObserver.disconnect();

            PostProcessor.parseUserInfo(targetElement);
            UserMemo.apply(targetElement);
            IPScouter.apply(targetElement);

            articles = targetElement.querySelectorAll('a.vrow');
            CategoryColor.apply(articles, channel);
            BlockSystem.blockPreview(articles, channel);
            BlockSystem.blockArticle(targetElement, articles, channel);
            AutoRemover.removeArticle(articles);

            boardObserver.observe(targetElement, { childList: true });
        });
        boardObserver.observe(targetElement, { childList: true });

        if(type != 'board-included') {
            const refreshTime = GM_getValue('refreshTime', Setting.defaultConfig.refreshTime);
            if(refreshTime) {
                const refresher = new AutoRefresher(targetElement, refreshTime);
                refresher.start();
            }
            ShortCut.apply('board');
        }
    }

    if(type == 'write') {
        await waitForElement('.fr-box');
        const editor = unsafeWindow.FroalaEditor('#content');
        ClipboardUpload.apply(editor);
        MyImage.apply(editor);
    }
}());
