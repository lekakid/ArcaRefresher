import { createSlice } from '@reduxjs/toolkit';
import HookInfo from './HookInfo';

const slice = createSlice({
  name: HookInfo.id,
  initialState: {},
  reducers: {
    setLoaded(state, action) {
      const selector = action.payload;
      state[selector] = true;
    },
  },
});

export const { setLoaded } = slice.actions;

export default [HookInfo.id, slice.reducer];
