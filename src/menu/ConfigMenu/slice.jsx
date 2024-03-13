import { createSlice } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

const initialState = {
  open: false,
  opacity: 1,
  drawer: true,
  selection: 'VersionInfo',
  group: '',
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    setOpen(state, action) {
      state.open = action.payload;
    },
    setOpacity(state, action) {
      state.opacity = action.payload;
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

export const { setOpen, setOpacity, setDrawer, setSelection, setGroup } =
  slice.actions;

export default slice.reducer;
