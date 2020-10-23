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
            AnonymousNick.apply(articleWrapper);

            LiveModifier.applyImageResize();
            ContextMenu.apply(articleWrapper);
            BlockSystem.blockRatedown();
            ImageDownloader.apply();

            const commentView = targetElement.querySelector('#comment');
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

        targetElement = targetElement.querySelector('.included-article-list .list-table');
        if (targetElement) type = 'board-included';
    }

    if (type.indexOf('board') > -1) {
        Setting.setupCategory(channel);

        PostProcessor.parseUserInfo(targetElement);
        UserMemo.apply(targetElement);
        IPScouter.apply(targetElement);

        CategoryColor.apply(targetElement, channel);
        BlockSystem.blockPreview(targetElement, channel);
        BlockSystem.blockContent(targetElement, channel);

        targetElement.addEventListener('ar_refresh', () => {
            PostProcessor.parseUserInfo(targetElement);
            UserMemo.apply(targetElement);
            IPScouter.apply(targetElement);

            CategoryColor.apply(targetElement, channel);
            BlockSystem.blockPreview(targetElement, channel);
            BlockSystem.blockContent(targetElement, channel);
            AutoRemover.removeArticle(targetElement);
        });

        if (type != 'board-included') {
            new AutoRefresher(targetElement, refreshTime).start();
            ShortCut.apply('board');
        }
    }

    if (type == 'write') {
        await waitForElement('.fr-box');
        // const FroalaEditor = unsafeWindow.FroalaEditor;
        const editor = unsafeWindow.FroalaEditor('#content');
        ClipboardUpload.apply(editor);
        MyImage.apply(editor);
        TemporaryArticle.apply(editor);
    }
}());
