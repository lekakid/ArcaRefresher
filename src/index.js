import PostProcessor from './core/PostProcessor';
import Setting from './core/Setting';

import AnonymousNick from './module/AnonymousNick';
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
import TemporaryArticle from './module/TemporaryArticle';
import UserMemo from './module/UserMemo';

import { waitForElement } from './util/ElementDetector';

(async function () {
    PostProcessor.addGlobalStyle();

    const path = location.pathname.split('/');
    const channel = path[2] || '';

    await waitForElement('.content-wrapper');
    Setting.setup(channel);

    try {
        LiveModifier.apply();
        NotificationIconColor.apply();
    }
    catch(error) {
        console.warn('글로벌 모듈 적용 중 오류 발생');
        console.error(error);
    }

    await waitForElement('footer');

    const articleElement = document.querySelector('article');
    const articleView = articleElement.querySelector('.article-view');
    const boardView = articleElement.querySelector('div.board-article-list .list-table, div.included-article-list .list-table');
    const writeView = articleElement.querySelector('.article-write');

    if (articleView) {
        try {
            const articleWrapper = articleView.querySelector('.article-wrapper');
            PostProcessor.parseUserInfo(articleWrapper);
            UserMemo.apply(articleWrapper);
            UserMemo.setHandler(articleWrapper);
            IPScouter.apply(articleWrapper);
            AnonymousNick.apply(articleWrapper);

            LiveModifier.applyImageResize();
            ContextMenu.apply(articleWrapper);
            BlockSystem.blockRatedown();
            ImageDownloader.apply();

            const commentView = articleView.querySelector('#comment');
            if (commentView) {
                BlockSystem.blockEmoticon(commentView);
                BlockSystem.blockContent(commentView);

                CommentRefresh.apply(commentView);
                EmoticonBlock.apply(commentView);
                FullAreaReply.apply(commentView);

                commentView.addEventListener('ar_refresh', () => {
                    PostProcessor.parseUserInfo(commentView);
                    UserMemo.apply(commentView);
                    IPScouter.apply(commentView);

                    BlockSystem.blockEmoticon(commentView);
                    BlockSystem.blockContent(commentView);
                    EmoticonBlock.apply(commentView);
                });
            }
        }
        catch (error) {
            console.warn('게시물 처리 중 오류 발생');
            console.error(error);
        }

        ShortCut.apply('article');
    }

    if (boardView) {
        Setting.setupCategory(channel);

        PostProcessor.parseUserInfo(boardView);
        UserMemo.apply(boardView);
        IPScouter.apply(boardView);

        CategoryColor.apply(boardView, channel);
        BlockSystem.blockPreview(boardView, channel);
        BlockSystem.blockContent(boardView, channel);

        boardView.addEventListener('ar_refresh', () => {
            PostProcessor.parseUserInfo(boardView);
            UserMemo.apply(boardView);
            IPScouter.apply(boardView);

            CategoryColor.apply(boardView, channel);
            BlockSystem.blockPreview(boardView, channel);
            BlockSystem.blockContent(boardView, channel);
            AutoRemover.removeArticle(boardView);
        });

        if (!boardView.closest('.included-article-list')) {
            new AutoRefresher(boardView, refreshTime).start();
        }
    }

    if(articleView) {
        ShortCut.apply('article');
    }
    else if(boardView) {
        ShortCut.apply('board');
    }

    if (writeView) {
        await waitForElement('.fr-box');
        // const FroalaEditor = unsafeWindow.FroalaEditor;
        const editor = unsafeWindow.FroalaEditor('#content');
        ClipboardUpload.apply(editor);
        MyImage.apply(editor);
        TemporaryArticle.apply(editor);
    }
}());
