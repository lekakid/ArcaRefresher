import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

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
  ...defaultConfigState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    addUser(state, action) {
      state.user.push(action.payload);
      GM_setValue(MODULE_ID, state);
    },
    removeUser(state, action) {
      const index = state.user.indexOf(action.payload);
      state.user.splice(index, 1);
      GM_setValue(MODULE_ID, state);
    },
    setUser(state, action) {
      state.user = action.payload;
      GM_setValue(MODULE_ID, state);
    },
    addKeyword(state, action) {
      state.keyword.push(action.payload);
      GM_setValue(MODULE_ID, state);
    },
    removeKeyword(state, action) {
      state.keyword.push(action.payload);
      GM_setValue(MODULE_ID, state);
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
      GM_setValue(MODULE_ID, state);
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
      GM_setValue(MODULE_ID, state);
    },
    removeEmoticonList(state, action) {
      action.payload.forEach((id) => {
        delete state.emoticon[id];
      });
      GM_setValue(MODULE_ID, state);
    },
    setCategoryConfig(state, action) {
      const { channel, config } = action.payload;
      state.category[channel] = config;
      GM_setValue(MODULE_ID, state);
    },
    toggleCountBar(state) {
      state.hideCountBar = !state.hideCountBar;
      GM_setValue(MODULE_ID, state);
    },
    toggleMutedMark(state) {
      state.hideMutedMark = !state.hideMutedMark;
      GM_setValue(MODULE_ID, state);
    },
    toggleIncludeReply(state) {
      state.muteIncludeReply = !state.muteIncludeReply;
      GM_setValue(MODULE_ID, state);
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
