import Configure from './core/Configure';
import ContextMenu from './core/ContextMenu';
import Parser from './core/Parser';
import { waitForElement } from './util/ElementDetector';

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
import NewWindow from './module/NewWindow';
import NotificationIconColor from './module/NotificationIconColor';
import RatedownGuard from './module/RatedownGuard';
import ShortCut from './module/ShortCut';
import TemporaryArticle from './module/TemporaryArticle';
import UserMemo from './module/UserMemo';

import FadeStyle from './css/Fade.css';
import { stylesheet as IPScouterStyle } from './css/IPScouter.module.css';

(async function () {
    await waitForElement('head');

    // Load Global CSS
    document.head.append(<style>{FadeStyle}{IPScouterStyle}</style>);

    await waitForElement('.content-wrapper');

    Parser.initialize();

    Configure.initialize();

    ContextMenu.initialize();

    AnonymousNick.load();
    ArticleRemover.load();
    AutoRefresher.load();
    CategoryColor.load();
    CommentRefresh.load();
    FullAreaReply.load();
    ImageDownloader.load();
    ImageSearch.load();
    IPScouter.load();
    LiveModifier.load();
    MuteContent.load();
    MuteEmoticon.load();
    NewWindow.load();
    NotificationIconColor.load();
    RatedownGuard.load();
    ShortCut.load();
    UserMemo.load();

    ClipboardUpload.load();
    MyImage.load();
    TemporaryArticle.load();
}());
