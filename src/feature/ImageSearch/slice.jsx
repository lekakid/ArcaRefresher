import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultState = {
  searchBySource: false,
  saucenaoBypass: false,
};

const initialState = getValue(Info.ID, defaultState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleSearchBySource(state) {
      state.searchBySource = !state.searchBySource;
      setValue(Info.ID, state);
    },
    toggleSauceNaoBypass(state) {
      state.saucenaoBypass = !state.saucenaoBypass;
      setValue(Info.ID, state);
    },
  },
});

export const { toggleSearchBySource, toggleSauceNaoBypass } = slice.actions;

export default slice.reducer;
