import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  color: {},
};

const initialState = getValue(MODULE_ID, defaultConfigState);

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setStyle(state, action) {
      const { channel, color } = action.payload;
      state.color[channel] = color;
      setValue(MODULE_ID, state);
    },
  },
});

export const { setStyle } = slice.actions;

export default slice.reducer;
