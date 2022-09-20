import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  enabled: true,
  fileName: '%title%',
  zipName: '%title%',
  zipImageName: '%num%',
};

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: 'ImageDownloader',
  initialState,
  reducers: {
    toggleEnable(state) {
      state.enabled = !state.enabled;
      setValue(Info.ID, state);
    },
    setFileName(state, action) {
      state.fileName = action.payload;
      setValue(Info.ID, state);
    },
    setZipName(state, action) {
      state.zipName = action.payload;
      setValue(Info.ID, state);
    },
    setZipImageName(state, action) {
      state.zipImageName = action.payload;
      setValue(Info.ID, state);
    },
  },
});

export const { toggleEnable, setFileName, setZipName, setZipImageName } =
  slice.actions;

export default slice.reducer;
