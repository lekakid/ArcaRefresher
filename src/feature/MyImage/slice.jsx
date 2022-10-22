import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  imgList: { _shared_: [] },
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
    $addImage(state, action) {
      const { channel, url } = action.payload;
      if (!state.storage.imgList[channel]) state.storage.imgList[channel] = [];
      state.storage.imgList[channel].push(url);
    },
    $removeImage(state, action) {
      const { channel, url } = action.payload;
      state.storage.imgList[channel] = state.storage.imgList[channel].filter(
        (u) => u !== url,
      );
    },
    $setImageList(state, action) {
      const { channel, list } = action.payload;
      state.storage.imgList[channel] = list;
    },
    $toggleForceLoad(state) {
      state.storage.forceLoad = !state.storage.forceLoad;
    },
  },
});

export const {
  $toggleEnabled,
  $addImage,
  $removeImage,
  $setImageList,
  $toggleForceLoad,
} = slice.actions;

export default slice.reducer;
