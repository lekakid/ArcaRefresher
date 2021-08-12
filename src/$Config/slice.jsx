import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuList: {},
  dialogOpen: false,
  selection: 'all',
};

export const slice = createSlice({
  name: 'Config',
  initialState,
  reducers: {
    addConfig(state, action) {
      const { key, listButton, content } = action.payload;
      state.menuList[key] = { listButton, content };
    },
    setDialogOpen(state, action) {
      state.dialogOpen = action.payload;
    },
    setSelection(state, action) {
      state.selection = action.payload;
    },
  },
});

export const { addConfig, setDialogOpen, setSelection } = slice.actions;

export default slice.reducer;