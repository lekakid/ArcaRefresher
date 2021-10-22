import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  enabled: false,
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
  },
});

export const { toggleEnabled } = slice.actions;

export default slice.reducer;
