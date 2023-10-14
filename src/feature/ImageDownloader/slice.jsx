import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  downloadMethod: 'fetch',
  fileName: '%title%',
  zipName: '%title%',
  zipExtension: 'zip',
  zipImageName: '%num%',
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
  open: false,
};

export const slice = createSlice({
  name: 'ImageDownloader',
  initialState,
  reducers: {
    $toggleEnable(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $setDownloadMethod(state, action) {
      state.storage.downloadMethod = action.payload;
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
    setOpen(state, action) {
      state.open = action.payload;
    },
  },
});

export const {
  $toggleEnable,
  $setDownloadMethod,
  $setFileName,
  $setZipName,
  $setZipExtension,
  $setZipImageName,
  setOpen,
} = slice.actions;

export default slice.reducer;
