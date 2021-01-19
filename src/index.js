import Configure from './core/Configure';
import ContextMenu from './core/ContextMenu';
import Parser from './core/Parser';
import Transition from './core/Transition';
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
import LiveModifier from './module/LayoutCustomizer';
import MyImage from './module/MyImage';
import NewWindow from './module/NewWindow';
import RatedownGuard from './module/RatedownGuard';
import ShortCut from './module/ShortCut';
import TemporaryArticle from './module/TemporaryArticle';
import UserMemo from './module/UserMemo';

import { stylesheet as IPScouterStyle } from './css/IPScouter.module.css';

(async function App() {
  await waitForElement('head');

  // Load Global CSS
  document.head.append(<style>{IPScouterStyle}</style>);
  Transition();

  await waitForElement('.content-wrapper');
  Configure();
  ContextMenu.initialize();

  LiveModifier.load();

  await waitForElement('footer');
  Parser();

  AutoRefresher.load();
  CommentRefresh.load();

  AnonymousNick.load();
  ArticleRemover.load();
  CategoryColor.load();
  FullAreaReply.load();
  ImageDownloader.load();
  ImageSearch.load();
  IPScouter.load();
  MuteContent.load();
  MuteEmoticon.load();
  NewWindow.load();
  RatedownGuard.load();
  ShortCut.load();
  UserMemo.load();

  ClipboardUpload.load();
  MyImage.load();
  TemporaryArticle.load();
})();
