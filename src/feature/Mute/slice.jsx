import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/storage';
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

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    addUser(state, action) {
      state.user.push(action.payload);
      setValue(Info.ID, state);
    },
    removeUser(state, action) {
      const index = state.user.indexOf(action.payload);
      state.user.splice(index, 1);
      setValue(Info.ID, state);
    },
    setUser(state, action) {
      state.user = action.payload;
      setValue(Info.ID, state);
    },
    addKeyword(state, action) {
      state.keyword.push(action.payload);
      setValue(Info.ID, state);
    },
    removeKeyword(state, action) {
      state.keyword.push(action.payload);
      setValue(Info.ID, state);
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
      setValue(Info.ID, state);
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
      setValue(Info.ID, state);
    },
    removeEmoticonList(state, action) {
      action.payload.forEach((id) => {
        delete state.emoticon[id];
      });
      setValue(Info.ID, state);
    },
    setCategoryConfig(state, action) {
      const { channel, config } = action.payload;
      state.category[channel] = config;
      setValue(Info.ID, state);
    },
    toggleCountBar(state) {
      state.hideCountBar = !state.hideCountBar;
      setValue(Info.ID, state);
    },
    toggleMutedMark(state) {
      state.hideMutedMark = !state.hideMutedMark;
      setValue(Info.ID, state);
    },
    toggleIncludeReply(state) {
      state.muteIncludeReply = !state.muteIncludeReply;
      setValue(Info.ID, state);
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
