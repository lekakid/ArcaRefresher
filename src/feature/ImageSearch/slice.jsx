import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  searchBySource: false,
  saucenaoBypass: false,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $toggleSearchBySource(state) {
      state.storage.searchBySource = !state.storage.searchBySource;
    },
    $toggleSauceNaoBypass(state) {
      state.storage.saucenaoBypass = !state.storage.saucenaoBypass;
    },
  },
});

export const { $toggleSearchBySource, $toggleSauceNaoBypass } = slice.actions;

export default slice.reducer;
