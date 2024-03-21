import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  // 모양
  unfoldLongComment: false,
  modifiedIndicator: false,
  reverseComment: false,
  hideVoiceComment: false,
  resizeEmoticonPalette: 2,
  // 동작
  foldComment: false,
  wideClickArea: true,
  alternativeSubmitKey: '',
};

function updater(storage, defaultValue) {
  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      const keys = Object.keys(defaultValue).filter((k) => k !== 'version');
      const entries = [];
      const oldLayoutValues = getValue('LayoutCustom');
      if (oldLayoutValues) {
        entries.push(
          ...Object.entries(oldLayoutValues).filter((pair) =>
            keys.includes(pair[0]),
          ),
        );
      }
      const oldExpValues = getValue('ExperienceCustom');
      if (oldExpValues) {
        entries.push(
          ...Object.entries(oldExpValues).filter((pair) =>
            keys.includes(pair[0]),
          ),
        );
      }

      return { ...defaultValue, ...Object.fromEntries(entries) };
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
    // 모양
    $toggleLongComment(state) {
      state.storage.unfoldLongComment = !state.storage.unfoldLongComment;
    },
    $toggleModifiedIndicator(state) {
      state.storage.modifiedIndicator = !state.storage.modifiedIndicator;
    },
    $toggleReverseComment(state) {
      state.storage.reverseComment = !state.storage.reverseComment;
    },
    $toggleHideVoiceComment(state) {
      state.storage.hideVoiceComment = !state.storage.hideVoiceComment;
    },
    $setResizeEmoticonPalette(state, action) {
      state.storage.resizeEmoticonPalette = action.payload;
    },
    // 동작
    $toggleFold(state) {
      state.storage.foldComment = !state.storage.foldComment;
    },
    $toggleWideArea(state) {
      state.storage.wideClickArea = !state.storage.wideClickArea;
    },
    $setAlternativeSubmitKey(state, action) {
      state.storage.alternativeSubmitKey = action.payload;
    },
  },
});

export const {
  // 모양
  $toggleLongComment,
  $toggleModifiedIndicator,
  $toggleReverseComment,
  $toggleHideVoiceComment,
  $setResizeEmoticonPalette,
  // 동작
  $toggleFold,
  $toggleWideArea,
  $setAlternativeSubmitKey,
} = slice.actions;

export default slice.reducer;
