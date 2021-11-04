import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  color: {},
};

const initialState = {
  ...defaultConfigState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setStyle(state, action) {
      const { channel, color } = action.payload;
      state.color[channel] = color;
      GM_setValue(MODULE_ID, state);
    },
  },
});

export const { setStyle } = slice.actions;

export default slice.reducer;
