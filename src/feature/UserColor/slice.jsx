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
    setColor(state, action) {
      const { user, color } = action.payload;
      if (color) {
        state.storage.color[user] = color;
      } else {
        delete state.storage.color[user];
      }
    },
    setColorList(state, action) {
      state.storage.color = action.payload;
    },
  },
});

export const { setColor, setColorList } = slice.actions;

export default slice.reducer;
