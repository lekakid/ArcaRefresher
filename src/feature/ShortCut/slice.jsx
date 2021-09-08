import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/gm';
import { MODULE_ID } from './ModuleInfo';

const ENABLED = { key: 'useShortcut', defaultValue: false };

const initialState = {
  enabled: getValue(ENABLED),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnabled(state) {
      state.enabled = !state.enabled;
      setValue(ENABLED, state.enabled);
    },
  },
});

export const { toggleEnabled } = slice.actions;

export default slice.reducer;
