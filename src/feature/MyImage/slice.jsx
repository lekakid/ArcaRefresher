import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/gm';
import { getChannelID } from 'util/parser';
import { MODULE_ID } from './ModuleInfo';

const ENABLED = { key: 'myImagesEnabled', defaultValue: true };
const MY_IMAGES = { key: 'myImages', defaultValue: { _shared_: [] } };
const FORCE_LOAD = { key: 'myImageForceLoad', defaultValue: false };

const initialState = {
  enabled: getValue(ENABLED),
  channelID: getChannelID(),
  imgList: getValue(MY_IMAGES),
  forceLoad: getValue(FORCE_LOAD),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnabled(state) {
      state.enabled = !state.enabled;
      setValue(ENABLED, state.enabled);
    },
    addImage(state, action) {
      const { channel, url } = action.payload;
      if (!state.imgList[channel]) state.imgList[channel] = [];
      state.imgList[channel].push(url);
      setValue(MY_IMAGES, state.imgList);
    },
    removeImage(state, action) {
      const { channel, url } = action.payload;
      state.imgList[channel].filter((u) => u !== url);
      setValue(MY_IMAGES, state.imgList);
    },
    setImageList(state, action) {
      const { channel, list } = action.payload;
      state.imgList[channel] = list;
      setValue(MY_IMAGES, state.imgList);
    },
    toggleForceLoad(state) {
      state.forceLoad = !state.forceLoad;
      setValue(FORCE_LOAD, state.forceLoad);
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
