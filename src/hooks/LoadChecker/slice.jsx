import { createSlice } from '@reduxjs/toolkit';
import hookInfo from './hookInfo';

const slice = createSlice({
  name: hookInfo.id,
  initialState: {},
  reducers: {
    setLoaded(state, action) {
      const selector = action.payload;
      state[selector] = true;
    },
  },
});

export const { setLoaded } = slice.actions;

export default [hookInfo.id, slice.reducer];
