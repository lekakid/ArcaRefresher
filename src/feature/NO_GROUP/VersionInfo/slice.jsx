import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';

import { TYPE_MINOR } from './func';
import Info from './FeatureInfo';

const defaultStorage = {
  checkedVersion: '',
  notiLevel: TYPE_MINOR,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $setCheckedVersion(state, action) {
      state.storage.checkedVersion = action.payload;
    },
    $setNotiLevel(state, action) {
      state.storage.notiLevel = action.payload;
    },
  },
});

export const { $setCheckedVersion, $setNotiLevel } = slice.actions;

export default slice.reducer;
