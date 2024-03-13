import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import { BACKGROUND } from 'func/window';

import Info from './FeatureInfo';

const defaultStorage = {
  openType: BACKGROUND,
  searchBySource: false,
  searchGoogleMethod: 'lens',
  saucenaoBypass: false,
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $setOpenType(state, action) {
      state.storage.openType = action.payload;
    },
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
  $setOpenType,
  $toggleSearchBySource,
  $setSearchGoogleMethod,
  $toggleSauceNaoBypass,
} = slice.actions;

export default slice.reducer;
