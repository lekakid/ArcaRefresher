import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const initialState = {
  menuList: [],
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    addHeaderMenu(state, action) {
      state.menuList.push(action.payload);
    },
  },
});

export const { addHeaderMenu } = slice.actions;

export default slice.reducer;
