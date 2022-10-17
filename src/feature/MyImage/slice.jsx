import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  enabled: true,
  imgList: { _shared_: [] },
  forceLoad: false,
};

const initialState = {
  config: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnabled(state) {
      state.config.enabled = !state.config.enabled;
    },
    addImage(state, action) {
      const { channel, url } = action.payload;
      if (!state.config.imgList[channel]) state.config.imgList[channel] = [];
      state.config.imgList[channel].push(url);
    },
    removeImage(state, action) {
      const { channel, url } = action.payload;
      state.config.imgList[channel] = state.config.imgList[channel].filter(
        (u) => u !== url,
      );
    },
    setImageList(state, action) {
      const { channel, list } = action.payload;
      state.config.imgList[channel] = list;
    },
    toggleForceLoad(state) {
      state.config.forceLoad = !state.config.forceLoad;
    },
  },
});

export const {
  toggleEnabled,
  addImage,
  removeImage,
  setImageList,
  toggleForceLoad,
} = slice.actions;

export default slice.reducer;
