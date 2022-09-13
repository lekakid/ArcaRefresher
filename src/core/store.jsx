import { configureStore } from '@reduxjs/toolkit';

import Config from 'menu/ConfigMenu/slice';
import ContextMenu from 'menu/ContextMenu/slice';

import AutoRefresher from 'feature/AutoRefresher/slice';
import ImageDownloader from 'feature/ImageDownloader/slice';
import ImageSearch from 'feature/ImageSearch/slice';
import VersionInfo from 'feature/VersionInfo/slice';
import AnonymousNick from 'feature/AnonymousNick/slice';
import Memo from 'feature/Memo/slice';
import LayoutCustom from 'feature/LayoutCustom/slice';
import ExperienceCustom from 'feature/ExperienceCustom/slice';
import TemporarySave from 'feature/TemporarySave/slice';
import Mute from 'feature/Mute/slice';
import MyImage from 'feature/MyImage/slice';
import CategoryStyler from 'feature/CategoryStyler/slice';
import UserColor from 'feature/UserColor/slice';
import ThemeCustomizer from 'feature/ThemeCustomizer/slice';

import Parser from 'util/Parser/slice';

export default configureStore({
  reducer: {
    // menu
    Config,
    ContextMenu,

    // feature
    AutoRefresher,
    ImageDownloader,
    ImageSearch,
    VersionInfo,
    AnonymousNick,
    Memo,
    LayoutCustom,
    ExperienceCustom,
    TemporarySave,
    Mute,
    MyImage,
    CategoryStyler,
    UserColor,
    ThemeCustomizer,

    // util
    Parser,
  },
});
