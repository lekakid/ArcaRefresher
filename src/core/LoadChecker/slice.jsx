import { createSlice } from '@reduxjs/toolkit';
import hookInfo from './info';

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

export default slice.reducer;
