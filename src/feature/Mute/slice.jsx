import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  user: [],
  keyword: [],
  emoticon: {},
  category: {},
  hideNoPermission: false,
  boardBarPos: 'afterbegin',
  hideCountBar: false,
  hideMutedMark: false,
  muteIncludeReply: false,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $addUser(state, action) {
      state.storage.user.push(action.payload);
    },
    $removeUser(state, action) {
      const index = state.storage.user.indexOf(action.payload);
      state.storage.user.splice(index, 1);
    },
    $setUser(state, action) {
      state.storage.user = action.payload;
    },
    $addKeyword(state, action) {
      state.storage.keyword.push(action.payload);
    },
    $removeKeyword(state, action) {
      state.storage.keyword.push(action.payload);
    },
    $setKeyword(state, action) {
      state.storage.keyword = action.payload;
    },
    $addEmoticon(state, action) {
      const { id, emoticon } = action.payload;
      if (state.storage.emoticon[id]) {
        const { bundle, url } = state.storage.emoticon[id];

        state.storage.emoticon[id] = {
          ...state.storage.emoticon[id],
          bundle: [...bundle, ...emoticon.bundle],
          url: [...url, ...emoticon.url],
        };
      } else {
        state.storage.emoticon[id] = emoticon;
      }
    },
    $removeEmoticonList(state, action) {
      action.payload.forEach((id) => {
        delete state.storage.emoticon[id];
      });
    },
    $setCategoryConfig(state, action) {
      const { channel, config } = action.payload;
      state.storage.category[channel] = config;
    },
    $toggleHideNoPermission(state) {
      state.storage.hideNoPermission = !state.storage.hideNoPermission;
    },
    $setBoardBarPos(state, action) {
      state.storage.boardBarPos = action.payload;
    },
    $toggleCountBar(state) {
      state.storage.hideCountBar = !state.storage.hideCountBar;
    },
    $toggleMutedMark(state) {
      state.storage.hideMutedMark = !state.storage.hideMutedMark;
    },
    $toggleIncludeReply(state) {
      state.storage.muteIncludeReply = !state.storage.muteIncludeReply;
    },
  },
});

export const {
  $addUser,
  $removeUser,
  $setUser,
  $addKeyword,
  $removeKeyword,
  $setKeyword,
  $addEmoticon,
  $removeEmoticonList,
  $setCategoryConfig,
  $toggleHideNoPermission,
  $setBoardBarPos,
  $toggleCountBar,
  $toggleMutedMark,
  $toggleIncludeReply,
} = slice.actions;

export default slice.reducer;
