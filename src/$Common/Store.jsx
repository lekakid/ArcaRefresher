import { configureStore } from '@reduxjs/toolkit';
import Config from '../$Config/slice';
import ContextMenu from '../$ContextMenu/slice';
import ArticleHeader from '../$ArticleHeader/slice';
import AutoRefresher from '../AutoRefresher/slice';
import ArticleRemover from '../ArticleRemover/slice';
import ImageDownloader from '../ImageDownloader/slice';
import AnonymousNick from '../AnonymousNick/slice';
import Memo from '../Memo/slice';
import LayoutCustom from '../LayoutCustom/slice';
import ExperienceCustom from '../ExperienceCustom/slice';
import TemporarySave from '../TemporarySave/slice';
import Mute from '../Mute/slice';
import MyImage from '../MyImage/slice';
import CategoryColor from '../CategoryColor/slice';

export default configureStore({
  reducer: {
    Config,
    ContextMenu,
    ArticleHeader,
    AutoRefresher,
    ArticleRemover,
    ImageDownloader,
    AnonymousNick,
    Memo,
    LayoutCustom,
    ExperienceCustom,
    TemporarySave,
    Mute,
    MyImage,
    CategoryColor,
  },
});
