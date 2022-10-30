import { createSlice } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

const initialState = {
  open: false,
  drawer: true,
  selection: 'VersionInfo',
  group: 'global',
};

export const slice = createSlice({
  name: Info.ID,
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
