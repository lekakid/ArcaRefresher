import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  showId: false,
  contextRange: 'articleItem',
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $toggleIdVisible(state) {
      state.storage.showId = !state.storage.showId;
    },
    $setContextRange(state, action) {
      state.storage.contextRange = action.payload;
    },
  },
});

export const { $toggleIdVisible, $setContextRange } = slice.actions;

export default slice.reducer;
