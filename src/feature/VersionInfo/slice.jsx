import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  checkedVersion: '',
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $updateCheckedVersion(state, action) {
      // eslint-disable-next-line camelcase
      state.storage.checkedVersion = action.payload;
    },
  },
});

export const { $updateCheckedVersion } = slice.actions;

export default slice.reducer;
