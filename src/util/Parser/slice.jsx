import { createSlice } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

const initialState = {
  channel: {
    ID: null,
    name: null,
    category: null,
  },
  article: {
    ID: null,
    category: null,
    title: null,
    author: null,
    url: null,
  },
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    setChannelInfo(state, action) {
      state.channel = action.payload;
    },
    setArticleInfo(state, action) {
      state.article = action.payload;
    },
  },
});

export const { setChannelInfo, setArticleInfo } = slice.actions;

export default slice.reducer;
