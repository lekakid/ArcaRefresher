import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  imgList: {},
  forceLoad: false,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $toggleEnabled(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $toggleForceLoad(state) {
      state.storage.forceLoad = !state.storage.forceLoad;
    },
    $addImage(state, action) {
      const { folder, url } = action.payload;
      state.storage.imgList[folder].push(url);
    },
    $removeImage(state, action) {
      const { folder, url } = action.payload;
      state.storage.imgList[folder] = state.storage.imgList[folder].filter(
        (u) => u !== url,
      );
    },
    $addFolder(state, action) {
      const folder = action.payload;
      state.storage.imgList[folder] = [];
    },
    $removeFolder(state, action) {
      const folder = action.payload;
      delete state.storage.imgList[folder];
    },
    $setFolderData(state, action) {
      const { folder, list } = action.payload;
      state.storage.imgList[folder] = list;
    },
  },
});

export const {
  $toggleEnabled,
  $toggleForceLoad,
  $addImage,
  $removeImage,
  $addFolder,
  $removeFolder,
  $setFolderData,
} = slice.actions;

export default slice.reducer;
