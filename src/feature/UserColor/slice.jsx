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
    setColor(state, action) {
      const { user, color } = action.payload;
      if (color) {
        state.color[user] = color;
      } else {
        delete state.color[user];
      }
      GM_setValue(MODULE_ID, state);
    },
    setColorList(state, action) {
      state.color = action.payload;
      GM_setValue(MODULE_ID, state);
    },
  },
});

export const { setColor, setColorList } = slice.actions;

export default slice.reducer;
