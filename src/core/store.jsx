import { configureStore } from '@reduxjs/toolkit';

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

import Parser from 'util/Parser/slice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

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
    Parser,
  },
});

(() => {
  function extractStorageEntries(state) {
    return Object.entries(state)
      .filter(([, value]) => !!value.storage)
      .map(([key, value]) => [key, value.storage]);
  }

  const initStorageEntires = extractStorageEntries(store.getState());
  initStorageEntires.forEach(([key]) => {
    GM_addValueChangeListener(key, (_key, _old, _new, remote) => {
      if (!remote) return;

      store.dispatch({ type: 'syncStorage' });
    });
  });

  store.subscribe(() => {
    const configEntries = extractStorageEntries(store.getState());
    configEntries.forEach(([key, value]) => setValue(key, value));
  });
})();

export function useSyncStorage(key, syncAction) {
  const dispatch = useDispatch();

  useEffect(() => {
    GM_addValueChangeListener(key, (_key, _oldValue, _newValue, remote) => {
      if (!remote) return;

      dispatch(syncAction());
    });
  }, [dispatch, key, syncAction]);
}

export default store;
