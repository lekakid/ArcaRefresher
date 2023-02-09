import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  showId: false,
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
  },
});

export const { $toggleIdVisible } = slice.actions;

export default slice.reducer;
