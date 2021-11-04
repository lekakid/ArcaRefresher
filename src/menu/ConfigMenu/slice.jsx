import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const initialState = {
  open: false,
  drawer: true,
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
    setDrawer(state, action) {
      state.drawer = action.payload;
    },
    setSelection(state, action) {
      state.selection = action.payload;
    },
    setGroup(state, action) {
      state.group = action.payload;
    },
  },
});

export const { setOpen, setDrawer, setSelection, setGroup } = slice.actions;

export default slice.reducer;
