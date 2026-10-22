import { createSlice } from '@reduxjs/toolkit';
import info from './info';

const slice = createSlice({
  name: info.id,
  initialState: {},
  reducers: {
    setLoaded(state, action) {
      const selector = action.payload;
      state[selector] = true;
    },
  },
});

export const { setLoaded } = slice.actions;

export default [info.id, slice.reducer];
