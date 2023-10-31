import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  color: {},
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $setCategoryStyle(state, action) {
      const { channel, category, value } = action.payload;
      if (!state.storage.color[channel]) state.storage.color[channel] = {};
      state.storage.color[channel][category] = value;
    },
    $setStyle(state, action) {
      const { channel, color } = action.payload;
      state.storage.color[channel] = color;
    },
  },
});

export const { $setCategoryStyle, $setStyle } = slice.actions;

export default slice.reducer;
