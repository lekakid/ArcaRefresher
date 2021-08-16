import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';
import { MODULE_ID } from './ModuleInfo';

const BLOCK_USER = { key: 'blockUser', defaultValue: [] };
const BLOCK_KEYWORD = { key: 'blockKeyword', defaultValue: [] };
const BLOCK_EMOTICON = { key: 'blockEmoticon', defaultValue: {} };
const MUTE_CATEGORY = { key: 'muteCategory', defaultValue: {} };
const HIDE_COUNT_BAR = { key: 'hideMuteBar', defaultValue: false };
const MUTE_INCLUDE_REPLY = { key: 'muteIncludeReply', defaultValue: false };

const initialState = {
  user: getValue(BLOCK_USER),
  keyword: getValue(BLOCK_KEYWORD),
  emoticon: getValue(BLOCK_EMOTICON),
  channelID: '',
  categoryConfig: getValue(MUTE_CATEGORY),
  hideCountBar: getValue(HIDE_COUNT_BAR),
  muteIncludeReply: getValue(MUTE_INCLUDE_REPLY),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    addUser(state, action) {
      state.user.push(action.payload);
      setValue(BLOCK_USER, state.user);
    },
    removeUser(state, action) {
      const index = state.user.indexOf(action.payload);
      state.user.splice(index, 1);
      setValue(BLOCK_USER, state.user);
    },
    setUser(state, action) {
      state.user = action.payload;
      setValue(BLOCK_USER, state.user);
    },
    addKeyword(state, action) {
      state.keyword.push(action.payload);
      setValue(BLOCK_KEYWORD, state.keyword);
    },
    removeKeyword(state, action) {
      state.keyword.push(action.payload);
      setValue(BLOCK_KEYWORD, state.keyword);
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
      setValue(BLOCK_KEYWORD, state.keyword);
    },
    addEmoticon(state, action) {
      const { id, emoticon } = action.payload;
      if (state.emoticon[id]) {
        const { bundle, url } = state.emoticon[id];

        state.emoticon[id] = {
          ...state.emoticon[id],
          bundle: [...bundle, ...emoticon.bundle],
          url: [...url, ...emoticon.url],
        };
      } else {
        state.emoticon[id] = emoticon;
      }
      setValue(BLOCK_EMOTICON, state.emoticon);
    },
    removeEmoticonList(state, action) {
      action.payload.forEach((id) => {
        delete state.emoticon[id];
      });
      setValue(BLOCK_EMOTICON, state.emoticon);
    },
    setChannelID(state, action) {
      state.channelID = action.payload;
    },
    setCategoryConfig(state, action) {
      const { id, categoryConfig } = action.payload;
      state.categoryConfig[id] = categoryConfig;
      setValue(MUTE_CATEGORY, state.categoryConfig);
    },
    toggleCountBar(state) {
      state.hideCountBar = !state.hideCountBar;
      setValue(HIDE_COUNT_BAR, state.hideCountBar);
    },
    toggleIncludeReply(state) {
      state.muteIncludeReply = !state.muteIncludeReply;
      setValue(MUTE_INCLUDE_REPLY, state.muteIncludeReply);
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
  setChannelID,
  setCategoryConfig,
  toggleCountBar,
  toggleIncludeReply,
} = slice.actions;

export default slice.reducer;
