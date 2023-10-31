import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  searchBySource: false,
  searchGoogleMethod: 'lens',
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
    $setSearchGoogleMethod(state, action) {
      state.storage.searchGoogleMethod = action.payload;
    },
    $toggleSauceNaoBypass(state) {
      state.storage.saucenaoBypass = !state.storage.saucenaoBypass;
    },
  },
});

export const {
  $toggleSearchBySource,
  $setSearchGoogleMethod,
  $toggleSauceNaoBypass,
} = slice.actions;

export default slice.reducer;
