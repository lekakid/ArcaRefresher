import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultState = {
  searchBySource: false,
  saucenaoBypass: false,
};

const initialState = {
  config: getValue(Info.ID, defaultState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleSearchBySource(state) {
      state.config.searchBySource = !state.config.searchBySource;
    },
    toggleSauceNaoBypass(state) {
      state.config.saucenaoBypass = !state.config.saucenaoBypass;
    },
  },
});

export const { toggleSearchBySource, toggleSauceNaoBypass } = slice.actions;

export default slice.reducer;
