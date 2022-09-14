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
    setColor(state, action) {
      const { user, color } = action.payload;
      if (color) {
        state.color[user] = color;
      } else {
        delete state.color[user];
      }
      setValue(Info.ID, state);
    },
    setColorList(state, action) {
      state.color = action.payload;
      setValue(Info.ID, state);
    },
  },
});

export const { setColor, setColorList } = slice.actions;

export default slice.reducer;
