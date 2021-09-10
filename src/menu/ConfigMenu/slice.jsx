import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const initialState = {
  open: false,
  selection: 'all',
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setOpen(state, action) {
      state.open = action.payload;
    },
    setSelection(state, action) {
      state.selection = action.payload;
    },
  },
});

export const { setOpen, setSelection } = slice.actions;

export default slice.reducer;
