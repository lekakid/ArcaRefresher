import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';

import { trimEmotURL } from './func';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  contextRange: 'nickname',
  boardBarPos: 'afterbegin',
  hideCountBar: false,
  hideMutedMark: false,
  muteIncludeReply: false,
  hideServiceNotice: false,
  hideNoPermission: false,
  hideClosedDeal: true,
  user: [],
  keyword: [],
  channel: [],
  muteAllEmot: false,
  emoticon: {},
  category: {},
};

function updater(storage, defaultValue) {
  if (!storage) return defaultValue;

  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      const data = Object.fromEntries(
        Object.entries(storage.emoticon).map(([key, emot]) => {
          emot.url = emot.url.map((u) => trimEmotURL(u));
          return [key, emot];
        }),
      );

      storage.emoticon = data;
      storage.version = 1;
      return storage;
    }
    default:
      console.warn('지원하지 않는 버전 데이터입니다.', storage);
      return defaultValue;
  }
}

const initialState = {
  storage: getValue(Info.id, defaultStorage, updater),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $setContextRange(state, action) {
      state.storage.contextRange = action.payload;
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
    $toggleHideNoticeService(state) {
      state.storage.hideServiceNotice = !state.storage.hideServiceNotice;
    },
    $toggleHideNoPermission(state) {
      state.storage.hideNoPermission = !state.storage.hideNoPermission;
    },
    $toggleHideClosedDeal(state) {
      state.storage.hideClosedDeal = !state.storage.hideClosedDeal;
    },
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
    $setChannel(state, action) {
      state.storage.channel = action.payload;
    },
    $toggleMuteAllEmot(state) {
      state.storage.muteAllEmot = !state.storage.muteAllEmot;
    },
    $addEmoticon(state, action) {
      const { id, emoticon } = action.payload;
      if (state.storage.emoticon[id]) {
        const { bundle, url } = state.storage.emoticon[id];

        const updatedBundle = [...bundle, ...emoticon.bundle];
        const updatedUrl = [...url, ...emoticon.url];

        state.storage.emoticon[id] = {
          ...state.storage.emoticon[id],
          bundle: updatedBundle.filter(
            (e, i) => updatedBundle.indexOf(e) === i,
          ),
          url: updatedUrl.filter((e, i) => updatedUrl.indexOf(e) === i),
        };
      } else {
        state.storage.emoticon[id] = emoticon;
      }
    },
    $removeEmoticon(state, action) {
      const { id, emotId, url } = action.payload;

      if (id && (emotId || url)) {
        if (!state.storage.emoticon[id]) {
          console.warn(`[Mute] 없는 이모티콘 삭제 시도 (${id})`);
          return;
        }

        let index = state.storage.emoticon[id].bundle.indexOf(emotId);
        if (index === -1) index = state.storage.emoticon[id].url.indexOf(url);

        state.storage.emoticon[id].bundle = state.storage.emoticon[
          id
        ].bundle.filter((_e, i) => i !== index);
        state.storage.emoticon[id].url = state.storage.emoticon[id].url.filter(
          (_u, i) => i !== index,
        );
        return;
      }

      if (id) {
        if (!state.storage.emoticon[id]) {
          console.warn(`[Mute] 없는 이모티콘 삭제 시도 (${id})`);
          return;
        }

        delete state.storage.emoticon[id];
        return;
      }

      console.warn(`[Mute] $removeEmoticon Payload 오류`);
    },
    $setEmoticonList(state, action) {
      state.storage.emoticon = action.payload;
    },
    $setCategoryConfig(state, action) {
      const { channel, category, config } = action.payload;
      if (!state.storage.category[channel])
        state.storage.category[channel] = {};
      state.storage.category[channel][category] = config;
    },
  },
});

export const {
  $setContextRange,
  $setBoardBarPos,
  $toggleCountBar,
  $toggleMutedMark,
  $toggleIncludeReply,
  $toggleHideNoticeService,
  $toggleHideNoPermission,
  $toggleHideClosedDeal,
  $addUser,
  $removeUser,
  $setUser,
  $addKeyword,
  $removeKeyword,
  $setKeyword,
  $setChannel,
  $toggleMuteAllEmot,
  $addEmoticon,
  $removeEmoticon,
  $setEmoticonList,
  $setCategoryConfig,
} = slice.actions;

export default slice.reducer;
