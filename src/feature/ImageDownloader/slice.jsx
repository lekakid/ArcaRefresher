import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  enabled: true,
  fileName: '%title%',
  zipName: '%title%',
  zipImageName: '%num%',
};

const initialState = {
  config: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: 'ImageDownloader',
  initialState,
  reducers: {
    toggleEnable(state) {
      state.config.enabled = !state.config.enabled;
    },
    setFileName(state, action) {
      state.config.fileName = action.payload;
    },
    setZipName(state, action) {
      state.config.zipName = action.payload;
    },
    setZipImageName(state, action) {
      state.config.zipImageName = action.payload;
    },
  },
});

export const { toggleEnable, setFileName, setZipName, setZipImageName } =
  slice.actions;

export default slice.reducer;
