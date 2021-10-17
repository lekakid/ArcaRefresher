import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultState = {
  saucenaoBypass: false,
};

const initialState = {
  ...defaultState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleSauceNaoBypass(state) {
      state.saucenaoBypass = !state.saucenaoBypass;
      GM_setValue(MODULE_ID, state);
    },
  },
});

export const { toggleSauceNaoBypass } = slice.actions;

export default slice.reducer;
