import { createSlice } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

const idRegex = /\/b\/([0-9a-z]{4,20})/;
const { pathname } = window.location;
const channelID = pathname.match(idRegex)?.[1] || null;

const initialState = {
  channel: {
    ID: channelID,
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
