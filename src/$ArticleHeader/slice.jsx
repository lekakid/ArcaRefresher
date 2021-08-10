import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuList: [],
};

export const slice = createSlice({
  name: 'ArticleHeader',
  initialState,
  reducers: {
    addHeaderMenu(state, action) {
      state.menuList.push(action.payload);
    },
  },
});

export const { addHeaderMenu } = slice.actions;

export default slice.reducer;
