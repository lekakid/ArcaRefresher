import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  // 동작 설정
  enabled: true,
  contextMenuEnabled: true,
  downloadOrigin: true,
  originToClipboard: false,
  // 파일 포맷
  startWithZero: false,
  fileName: '%title%',
  zipName: '%title%',
  zipExtension: 'zip',
  zipImageName: '%num%',
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
  open: false,
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    // 동작 설정
    $toggleEnable(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $toggleContextMenu(state) {
      state.storage.contextMenuEnabled = !state.storage.contextMenuEnabled;
    },
    $toggleDownloadOrigin(state) {
      state.storage.downloadOrigin = !state.storage.downloadOrigin;
    },
    $toggleOriginToClipboard(state) {
      state.storage.originToClipboard = !state.storage.originToClipboard;
    },
    // 파일 포멧
    $toggleStartWithZero(state) {
      state.storage.startWithZero = !state.storage.startWithZero;
    },
    $setFileName(state, action) {
      state.storage.fileName = action.payload;
    },
    $setZipName(state, action) {
      state.storage.zipName = action.payload;
    },
    $setZipExtension(state, action) {
      state.storage.zipExtension = action.payload;
    },
    $setZipImageName(state, action) {
      state.storage.zipImageName = action.payload;
    },
    // 상태
    setOpen(state, action) {
      state.open = action.payload;
    },
  },
});

export const {
  // 동작 설정
  $toggleEnable,
  $toggleContextMenu,
  $toggleDownloadOrigin,
  $toggleOriginToClipboard,
  // 파일 포맷
  $toggleStartWithZero,
  $setFileName,
  $setZipName,
  $setZipExtension,
  $setZipImageName,
  // 상태
  setOpen,
} = slice.actions;

export default slice.reducer;
