import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/gm';
import { getChannelID } from 'util/parser';
import { MODULE_ID } from './ModuleInfo';

const ENABLED = { key: 'enabledTheme', defaultValue: false };
const CURRENT_PRESET = { key: 'currentPreset', defaultValue: '' };
const THEME_PRESET = { key: 'themePreset', defaultValue: {} };

const initialState = {
  enabled: getValue(ENABLED),
  current: getValue(CURRENT_PRESET),
  channelID: getChannelID(),
  theme: getValue(THEME_PRESET),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.enabled = !state.enabled;
      setValue(ENABLED, state.enabled);
    },
    setCurrent(state, action) {
      state.current = action.payload;
      setValue(CURRENT_PRESET, state.current);
    },
    setPreset(state, action) {
      const { key, preset } = action.payload;
      if (preset) state.theme[key] = preset;
      else delete state.theme[key];
      setValue(THEME_PRESET, state.theme);
    },
    renamePreset(state, action) {
      const { prev, next } = action.payload;
      state.theme[next] = state.theme[prev];
      delete state.theme[prev];
      setValue(THEME_PRESET, state.theme);
    },
  },
});

export const { toggleEnable, setCurrent, setPreset, renamePreset } =
  slice.actions;

export default slice.reducer;
