import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';
import { getChannelID } from '../$Common/Parser';
import { MODULE_ID } from './ModuleInfo';

const CATEGORY_COLOR = { key: 'categoryColor', defaultValue: {} };

const initialState = {
  channelID: getChannelID(),
  color: getValue(CATEGORY_COLOR),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setStyle(state, action) {
      const { channel, color } = action.payload;
      state.color[channel] = color;
      setValue(CATEGORY_COLOR, state.color);
    },
  },
});

export const { setStyle } = slice.actions;

export default slice.reducer;
