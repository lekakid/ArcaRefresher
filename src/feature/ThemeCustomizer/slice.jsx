import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  enabled: false,
  current: '',
  theme: {},
};

const initialState = {
  config: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.config.enabled = !state.config.enabled;
    },
    setCurrent(state, action) {
      state.config.current = action.payload;
    },
    setPreset(state, action) {
      const { key, preset } = action.payload;
      if (preset) state.config.theme[key] = preset;
      else delete state.config.theme[key];
    },
    renamePreset(state, action) {
      const { prev, next } = action.payload;
      state.config.theme[next] = state.config.theme[prev];
      delete state.config.theme[prev];
    },
  },
});

export const { toggleEnable, setCurrent, setPreset, renamePreset } =
  slice.actions;

export default slice.reducer;
