import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  enabled: false,
  current: '',
  theme: {},
};

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.enabled = !state.enabled;
      setValue(Info.ID, state);
    },
    setCurrent(state, action) {
      state.current = action.payload;
      setValue(Info.ID, state);
    },
    setPreset(state, action) {
      const { key, preset } = action.payload;
      if (preset) state.theme[key] = preset;
      else delete state.theme[key];
      setValue(Info.ID, state);
    },
    renamePreset(state, action) {
      const { prev, next } = action.payload;
      state.theme[next] = state.theme[prev];
      delete state.theme[prev];
      setValue(Info.ID, state);
    },
  },
});

export const { toggleEnable, setCurrent, setPreset, renamePreset } =
  slice.actions;

export default slice.reducer;
