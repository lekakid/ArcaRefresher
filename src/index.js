import Setting from './core/Setting';
import ContextMenu from './core/ContextMenu';

import AnonymousNick from './module/AnonymousNick';
import AutoRefresher from './module/AutoRefresher';
import ArticleRemover from './module/ArticleRemover';
import MuteContent from './module/MuteContent';
import CategoryColor from './module/CategoryColor';
import ClipboardUpload from './module/ClipboardUpload';
import CommentRefresh from './module/CommentRefresh';
import MuteEmoticon from './module/MuteEmoticon';
import FullAreaReply from './module/FullAreaReply';
import IPScouter from './module/IPScouter';
import ImageDownloader from './module/ImageDownloader';
import ImageSearch from './module/ImageSearch';
import LiveModifier from './module/LiveModifier';
import MyImage from './module/MyImage';
import NotificationIconColor from './module/NotificationIconColor';
import RatedownGuard from './module/RatedownGuard';
import ShortCut from './module/ShortCut';
import TemporaryArticle from './module/TemporaryArticle';
import UserMemo from './module/UserMemo';

import { waitForElement } from './util/ElementDetector';

import FadeStyle from './css/Fade.css';
import { stylesheet as IPScouterStyle } from './css/IPScouter.module.css';

(async function () {
    // Load Global CSS
    document.head.append(<style>{FadeStyle}{IPScouterStyle}</style>);

    const path = location.pathname.split('/');
    const channel = path[2] || '';

    await waitForElement('.content-wrapper');
    Setting.initialize();
    ContextMenu.initialize();

    ArticleRemover.initialize();
    AutoRefresher.initialize();
    CategoryColor.initialize(channel);
    ImageDownloader.initialize();
    ImageSearch.initialize();
    RatedownGuard.initialize();
    ShortCut.initialize();
    MuteContent.initialize(channel);
    MuteEmoticon.initialize();
    MyImage.initialize(channel);
    NotificationIconColor.initialize();
    UserMemo.initialize();
    LiveModifier.initialize();

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
            UserMemo.apply(articleWrapper);
            UserMemo.setHandler(articleWrapper);
            IPScouter.apply(articleWrapper);
            AnonymousNick.apply(articleWrapper);

            RatedownGuard.apply();
            ImageDownloader.apply();

            const commentView = articleView.querySelector('#comment');
            if (commentView) {
                MuteEmoticon.mute(commentView);
                MuteContent.muteContent(commentView);

                CommentRefresh.apply(commentView);
                MuteEmoticon.apply(commentView);
                FullAreaReply.apply(commentView);

                commentView.addEventListener('ar_refresh', () => {
                    UserMemo.apply(commentView);
                    IPScouter.apply(commentView);

                    MuteEmoticon.apply(commentView);
                    MuteContent.muteContent(commentView);
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
        UserMemo.apply(boardView);
        IPScouter.apply(boardView);

        CategoryColor.apply(boardView, channel);
        MuteContent.mutePreview(boardView, channel);
        MuteContent.muteContent(boardView, channel);

        boardView.addEventListener('ar_refresh', () => {
            UserMemo.apply(boardView);
            IPScouter.apply(boardView);

            CategoryColor.apply(boardView, channel);
            MuteContent.mutePreview(boardView, channel);
            MuteContent.muteContent(boardView, channel);
            ArticleRemover.remove(boardView);
        });

        if (!boardView.closest('.included-article-list')) {
            AutoRefresher.apply(boardView);
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
        MyImage.apply(editor, channel);
        TemporaryArticle.apply(editor);
    }
}());
