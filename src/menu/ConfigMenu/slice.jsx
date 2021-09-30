import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const initialState = {
  open: false,
  selection: 'all',
  group: 'global',
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
    setGroup(state, action) {
      state.group = action.payload;
    },
  },
});

export const { setOpen, setSelection, setGroup } = slice.actions;

export default slice.reducer;
