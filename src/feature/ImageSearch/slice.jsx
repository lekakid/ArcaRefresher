import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultState = {
  saucenaoBypass: false,
};

const initialState = getValue(Info.ID, defaultState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleSauceNaoBypass(state) {
      state.saucenaoBypass = !state.saucenaoBypass;
      setValue(Info.ID, state);
    },
  },
});

export const { toggleSauceNaoBypass } = slice.actions;

export default slice.reducer;
