import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  enabled: true,
  imgList: { _shared_: [] },
  forceLoad: false,
};

const initialState = getValue(MODULE_ID, defaultConfigState);

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnabled(state) {
      state.enabled = !state.enabled;
      setValue(MODULE_ID, state);
    },
    addImage(state, action) {
      const { channel, url } = action.payload;
      if (!state.imgList[channel]) state.imgList[channel] = [];
      state.imgList[channel].push(url);
      setValue(MODULE_ID, state);
    },
    removeImage(state, action) {
      const { channel, url } = action.payload;
      state.imgList[channel] = state.imgList[channel].filter((u) => u !== url);
      setValue(MODULE_ID, state);
    },
    setImageList(state, action) {
      const { channel, list } = action.payload;
      state.imgList[channel] = list;
      setValue(MODULE_ID, state);
    },
    toggleForceLoad(state) {
      state.forceLoad = !state.forceLoad;
      setValue(MODULE_ID, state);
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
