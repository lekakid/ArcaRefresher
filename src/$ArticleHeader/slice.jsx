import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuList: [],
};

export const articleHeaderSlice = createSlice({
  name: 'ArticleHeader',
  initialState,
  reducers: {
    addHeaderMenu(state, action) {
      state.menuList.push(action.payload);
    },
  },
});

export const { addHeaderMenu } = articleHeaderSlice.actions;

export default articleHeaderSlice.reducer;
