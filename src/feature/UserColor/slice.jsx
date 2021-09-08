import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/gm';
import { MODULE_ID } from './ModuleInfo';

const USER_COLOR = { key: 'userColor', defaultValue: {} };

const initialState = {
  color: getValue(USER_COLOR),
  open: false,
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
      setValue(USER_COLOR, state.color);
    },
    setColorList(state, action) {
      state.color = action.payload;
      setValue(USER_COLOR, action.payload);
    },
    setOpenDialog(state, action) {
      state.open = action.payload;
    },
  },
});

export const { setColor, setColorList, setOpenDialog } = slice.actions;

export default slice.reducer;
