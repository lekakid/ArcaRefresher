import { unsafeWindow } from '$';
import { createSlice } from '@reduxjs/toolkit';

import info from './info';

const pathToken = window.location.pathname.split('/');
pathToken.shift(); // ''
const pageType = pathToken.shift();
let channelId = pathToken.shift();
let channelName;
switch (pageType) {
  case 'b': // 게시판
  case 'r': // 같이보기
    // Nothing
    break;
  case 'e':
    channelId = 'emoticon';
    channelName = '아카콘';
    break;
  case 'reports':
    channelId = pathToken.shift();
    break;
  default:
    channelId = 'ArcaLive';
    channelName = '아카라이브';
    break;
}

const initialState = {
  user: undefined,
  channel: {
    id: channelId,
    name: channelName,
  },
  category: undefined,
  article: undefined,
  config: unsafeWindow.LiveConfig,
};

const slice = createSlice({
  name: info.id,
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setChannelName(state, action) {
      state.channel.name = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setArticle(state, action) {
      state.article = action.payload;
    },
    setConfig(state, action) {
      state.config = action.payload;
    },
  },
});

export const { setUser, setChannelName, setCategory, setArticle, setConfig } =
  slice.actions;

export default slice.reducer;
