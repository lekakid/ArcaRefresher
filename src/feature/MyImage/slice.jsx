import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  enabled: true,
  imgList: { _shared_: [] },
  forceLoad: false,
};

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnabled(state) {
      state.enabled = !state.enabled;
      setValue(Info.ID, state);
    },
    addImage(state, action) {
      const { channel, url } = action.payload;
      if (!state.imgList[channel]) state.imgList[channel] = [];
      state.imgList[channel].push(url);
      setValue(Info.ID, state);
    },
    removeImage(state, action) {
      const { channel, url } = action.payload;
      state.imgList[channel] = state.imgList[channel].filter((u) => u !== url);
      setValue(Info.ID, state);
    },
    setImageList(state, action) {
      const { channel, list } = action.payload;
      state.imgList[channel] = list;
      setValue(Info.ID, state);
    },
    toggleForceLoad(state) {
      state.forceLoad = !state.forceLoad;
      setValue(Info.ID, state);
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
