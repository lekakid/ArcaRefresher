import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  user: [],
  keyword: [],
  emoticon: {},
  category: {},
  hideCountBar: false,
  hideMutedMark: false,
  muteIncludeReply: false,
};

const initialState = {
  config: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    addUser(state, action) {
      state.config.user.push(action.payload);
    },
    removeUser(state, action) {
      const index = state.config.user.indexOf(action.payload);
      state.config.user.splice(index, 1);
    },
    setUser(state, action) {
      state.config.user = action.payload;
    },
    addKeyword(state, action) {
      state.config.keyword.push(action.payload);
    },
    removeKeyword(state, action) {
      state.config.keyword.push(action.payload);
    },
    setKeyword(state, action) {
      state.config.keyword = action.payload;
    },
    addEmoticon(state, action) {
      const { id, emoticon } = action.payload;
      if (state.config.emoticon[id]) {
        const { bundle, url } = state.config.emoticon[id];

        state.config.emoticon[id] = {
          ...state.config.emoticon[id],
          bundle: [...bundle, ...emoticon.bundle],
          url: [...url, ...emoticon.url],
        };
      } else {
        state.config.emoticon[id] = emoticon;
      }
    },
    removeEmoticonList(state, action) {
      action.payload.forEach((id) => {
        delete state.config.emoticon[id];
      });
    },
    setCategoryConfig(state, action) {
      const { channel, config } = action.payload;
      state.config.category[channel] = config;
    },
    toggleCountBar(state) {
      state.config.hideCountBar = !state.config.hideCountBar;
    },
    toggleMutedMark(state) {
      state.config.hideMutedMark = !state.config.hideMutedMark;
    },
    toggleIncludeReply(state) {
      state.config.muteIncludeReply = !state.config.muteIncludeReply;
    },
  },
});

export const {
  addUser,
  removeUser,
  setUser,
  addKeyword,
  removeKeyword,
  setKeyword,
  addEmoticon,
  removeEmoticonList,
  setCategoryConfig,
  toggleCountBar,
  toggleMutedMark,
  toggleIncludeReply,
} = slice.actions;

export default slice.reducer;
