import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: false,
  current: '',
  theme: {},
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    setCurrent(state, action) {
      state.storage.current = action.payload;
    },
    setPreset(state, action) {
      const { key, preset } = action.payload;
      if (preset) state.storage.theme[key] = preset;
      else delete state.storage.theme[key];
    },
    renamePreset(state, action) {
      const { prev, next } = action.payload;
      state.storage.theme[next] = state.storage.theme[prev];
      delete state.storage.theme[prev];
    },
  },
  extraReducers: {
    syncStorage(state) {
      state.storage = getValue(Info.ID, defaultStorage);
    },
  },
});

export const { toggleEnable, setCurrent, setPreset, renamePreset } =
  slice.actions;

export default slice.reducer;
