import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  color: {},
};

const initialState = {
  storage: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    setStyle(state, action) {
      const { channel, color } = action.payload;
      state.storage.color[channel] = color;
    },
  },
});

export const { setStyle } = slice.actions;

export default slice.reducer;
