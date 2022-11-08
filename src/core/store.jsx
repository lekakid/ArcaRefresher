import { configureStore } from '@reduxjs/toolkit';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';

import { setValue } from 'core/storage';

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
import MediaBlocker from 'feature/MediaBlocker/slice';

import ContentInfo from 'util/ContentInfo/slice';
import LoadChecker from 'util/LoadChecker/slice';

const syncConfig = {
  predicate: (action) => action.type.indexOf('/$') > -1,
};

const store = configureStore({
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
    MediaBlocker,

    // util
    ContentInfo,
    LoadChecker,
  },
  middleware: [createStateSyncMiddleware(syncConfig)],
});

store.subscribe(() => {
  Object.entries(store.getState())
    .filter(([, value]) => !!value.storage)
    .map(([key, value]) => setValue(key, value.storage));
});

initMessageListener(store);

export default store;
