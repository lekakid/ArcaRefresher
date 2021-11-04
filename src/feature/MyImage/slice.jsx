import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  enabled: true,
  imgList: { _shared_: [] },
  forceLoad: false,
};

const initialState = {
  ...defaultConfigState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnabled(state) {
      state.enabled = !state.enabled;
      GM_setValue(MODULE_ID, state);
    },
    addImage(state, action) {
      const { channel, url } = action.payload;
      if (!state.imgList[channel]) state.imgList[channel] = [];
      state.imgList[channel].push(url);
      GM_setValue(MODULE_ID, state);
    },
    removeImage(state, action) {
      const { channel, url } = action.payload;
      state.imgList[channel] = state.imgList[channel].filter((u) => u !== url);
      GM_setValue(MODULE_ID, state);
    },
    setImageList(state, action) {
      const { channel, list } = action.payload;
      state.imgList[channel] = list;
      GM_setValue(MODULE_ID, state);
    },
    toggleForceLoad(state) {
      state.forceLoad = !state.forceLoad;
      GM_setValue(MODULE_ID, state);
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
