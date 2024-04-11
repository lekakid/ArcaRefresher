import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import { BACKGROUND } from 'func/window';

import Info from './FeatureInfo';

const defaultStorage = {
  // 동작
  contextMenuEnabled: true,
  openType: BACKGROUND,
  searchBySource: false,
  searchGoogleMethod: 'lens',
  saucenaoBypass: false,
  // 사이트
  showGoogle: true,
  showBing: true,
  showYandex: true,
  showSauceNao: true,
  showIqdb: true,
  showAscii2D: true,
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    // 동작
    $toggleContextMenu(state) {
      state.storage.contextMenuEnabled = !state.storage.contextMenuEnabled;
    },
    $setOpenType(state, action) {
      state.storage.openType = action.payload;
    },
    $toggleSearchBySource(state) {
      state.storage.searchBySource = !state.storage.searchBySource;
    },
    $setSearchGoogleMethod(state, action) {
      state.storage.searchGoogleMethod = action.payload;
    },
    $toggleSauceNaoBypass(state) {
      state.storage.saucenaoBypass = !state.storage.saucenaoBypass;
    },
    // 사이트
    $toggleShowGoogle(state) {
      state.storage.showGoogle = !state.storage.showGoogle;
    },
    $toggleShowBing(state) {
      state.storage.showBing = !state.storage.showBing;
    },
    $toggleShowYandex(state) {
      state.storage.showYandex = !state.storage.showYandex;
    },
    $toggleShowSauceNao(state) {
      state.storage.showSauceNao = !state.storage.showSauceNao;
    },
    $toggleShowIqdb(state) {
      state.storage.showIqdb = !state.storage.showIqdb;
    },
    $toggleShowAscii2D(state) {
      state.storage.showAscii2D = !state.storage.showAscii2D;
    },
  },
});

export const {
  // 동작
  $toggleContextMenu,
  $setOpenType,
  $toggleSearchBySource,
  $setSearchGoogleMethod,
  $toggleSauceNaoBypass,
  // 사이트
  $toggleShowGoogle,
  $toggleShowBing,
  $toggleShowYandex,
  $toggleShowSauceNao,
  $toggleShowIqdb,
  $toggleShowAscii2D,
} = slice.actions;

export default slice.reducer;
