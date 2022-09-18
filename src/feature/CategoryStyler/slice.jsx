import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  color: {},
};

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    setStyle(state, action) {
      const { channel, color } = action.payload;
      state.color[channel] = color;
      setValue(Info.ID, state);
    },
  },
});

export const { setStyle } = slice.actions;

export default slice.reducer;
