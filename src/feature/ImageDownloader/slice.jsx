import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  enabled: true,
  fileName: '%title%',
  zipName: '%title%',
  zipImageName: '%num%',
  zipComment: '[%channel%] %title% - %url%',
};

const initialState = getValue(MODULE_ID, defaultConfigState);

export const slice = createSlice({
  name: 'ImageDownloader',
  initialState,
  reducers: {
    toggleEnable(state) {
      state.enabled = !state.enabled;
      setValue(MODULE_ID, state);
    },
    setFileName(state, action) {
      state.fileName = action.payload;
      setValue(MODULE_ID, state);
    },
    setZipName(state, action) {
      state.zipName = action.payload;
      setValue(MODULE_ID, state);
    },
    setZipImageName(state, action) {
      state.zipImageName = action.payload;
      setValue(MODULE_ID, state);
    },
    setZipComment(state, action) {
      state.zipComment = action.payload;
      setValue(MODULE_ID, state);
    },
  },
});

export const {
  toggleEnable,
  setFileName,
  setZipName,
  setZipImageName,
  setZipComment,
} = slice.actions;

export default slice.reducer;
