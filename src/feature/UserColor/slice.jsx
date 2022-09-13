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
    setColor(state, action) {
      const { user, color } = action.payload;
      if (color) {
        state.color[user] = color;
      } else {
        delete state.color[user];
      }
      setValue(MODULE_ID, state);
    },
    setColorList(state, action) {
      state.color = action.payload;
      setValue(MODULE_ID, state);
    },
  },
});

export const { setColor, setColorList } = slice.actions;

export default slice.reducer;
