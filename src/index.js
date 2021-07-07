import * as AREventHandler from './core/AREventHandler';
import * as Configure from './core/Configure';
import * as ContextMenu from './core/ContextMenu';
import * as Transition from './core/Transition';

import AnonymousNick from './module/AnonymousNick';
import AutoRefresher from './module/AutoRefresher';
import ArticleRemover from './module/ArticleRemover';
import MuteContent from './module/MuteContent';
import CategoryColor from './module/CategoryColor';
import CommentRefresh from './module/CommentRefresh';
import MuteEmoticon from './module/MuteEmoticon';
import IPScouter from './module/IPScouter';
import ImageDownloader from './module/ImageDownloader';
import ImageSearch from './module/ImageSearch';
import LayoutCustomizer from './module/LayoutCustomizer';
import MyImage from './module/MyImage';
import NewWindow from './module/NewWindow';
import RatedownGuard from './module/RatedownGuard';
import ShortCut from './module/ShortCut';
import TemporaryArticle from './module/TemporaryArticle';
import * as ThemeCustomizer from './module/ThemeCustomizer';
import UserColor from './module/UserColor';
import UserMemo from './module/UserMemo';

(function App() {
  // Event Related Core Module
  AREventHandler.initialize();

  // UI Related Core Module
  Transition.initilaize();
  Configure.initialize();
  ContextMenu.load();

  // Feature Module
  AutoRefresher.load();
  CommentRefresh.load();

  LayoutCustomizer.load();
  AnonymousNick.load();
  ArticleRemover.load();
  CategoryColor.load();
  ImageDownloader.load();
  ImageSearch.load();
  IPScouter.load();
  MuteContent.load();
  MuteEmoticon.load();
  NewWindow.load();
  RatedownGuard.load();
  ShortCut.load();
  ThemeCustomizer.load();
  UserColor.load();
  UserMemo.load();

  MyImage.load();
  TemporaryArticle.load();
})();
