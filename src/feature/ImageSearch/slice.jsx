import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultState = {
  saucenaoBypass: false,
};

const initialState = getValue(MODULE_ID, defaultState);

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleSauceNaoBypass(state) {
      state.saucenaoBypass = !state.saucenaoBypass;
      setValue(MODULE_ID, state);
    },
  },
});

export const { toggleSauceNaoBypass } = slice.actions;

export default slice.reducer;
