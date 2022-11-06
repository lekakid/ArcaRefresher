import { createSlice } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

const initialState = {
  load: {
    article: false,
    board: false,
    comment: false,
    write: false,
  },
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
    setLoadInfo(state, action) {
      state.load = {
        ...state.load,
        ...action.payload,
      };
    },
    setChannelInfo(state, action) {
      state.channel = {
        ...state.channel,
        ...action.payload,
      };
    },
    setArticleInfo(state, action) {
      state.article = {
        ...state.article,
        ...action.payload,
      };
    },
  },
});

export const { setLoadInfo, setChannelInfo, setArticleInfo } = slice.actions;

export default slice.reducer;
