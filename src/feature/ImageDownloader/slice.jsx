import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  fileName: '%title%',
  zipName: '%title%',
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
    $setFileName(state, action) {
      state.storage.fileName = action.payload;
    },
    $setZipName(state, action) {
      state.storage.zipName = action.payload;
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
  $setFileName,
  $setZipName,
  $setZipImageName,
  setOpen,
} = slice.actions;

export default slice.reducer;
