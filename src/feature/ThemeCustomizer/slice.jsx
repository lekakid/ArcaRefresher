import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  enabled: false,
  current: '',
  theme: {},
};

const initialState = getValue(MODULE_ID, defaultConfigState);

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.enabled = !state.enabled;
      setValue(MODULE_ID, state);
    },
    setCurrent(state, action) {
      state.current = action.payload;
      setValue(MODULE_ID, state);
    },
    setPreset(state, action) {
      const { key, preset } = action.payload;
      if (preset) state.theme[key] = preset;
      else delete state.theme[key];
      setValue(MODULE_ID, state);
    },
    renamePreset(state, action) {
      const { prev, next } = action.payload;
      state.theme[next] = state.theme[prev];
      delete state.theme[prev];
      setValue(MODULE_ID, state);
    },
  },
});

export const { toggleEnable, setCurrent, setPreset, renamePreset } =
  slice.actions;

export default slice.reducer;
