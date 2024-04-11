import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  contextMenuEnabled: true,
  downloadMethod: 'fetch',
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
    $setDownloadMethod(state, action) {
      state.storage.downloadMethod = action.payload;
    },
    // 파일 포멧
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
  $toggleEnable,
  $toggleContextMenu,
  $setDownloadMethod,
  $setFileName,
  $setZipName,
  $setZipExtension,
  $setZipImageName,
  setOpen,
} = slice.actions;

export default slice.reducer;
