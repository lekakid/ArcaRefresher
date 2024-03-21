import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  // 모양
  hideDefaultImage: false,
  resizeImage: 100,
  resizeVideo: 100,
  hideUnvote: false,
  // 동작
  blockMediaNewWindow: false,
  ignoreExternalLinkWarning: false,
  ratedownGuard: false,
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
    $toggleDefaultImage(state) {
      state.storage.hideDefaultImage = !state.storage.hideDefaultImage;
    },
    $setResizeImage(state, action) {
      state.storage.resizeImage = action.payload;
    },
    $setResizeVideo(state, action) {
      state.storage.resizeVideo = action.payload;
    },
    $toggleUnvote(state) {
      state.storage.hideUnvote = !state.storage.hideUnvote;
    },
    // 동작
    $toggleBlockMediaNewWindow(state) {
      state.storage.blockMediaNewWindow = !state.storage.blockMediaNewWindow;
    },
    $toggleIgnoreExternalLinkWarning(state) {
      state.storage.ignoreExternalLinkWarning =
        !state.storage.ignoreExternalLinkWarning;
    },
    $toggleRateDownGuard(state) {
      state.storage.ratedownGuard = !state.storage.ratedownGuard;
    },
  },
});

export const {
  // 모양
  $toggleDefaultImage,
  $setResizeImage,
  $setResizeVideo,
  $toggleUnvote,
  // 동작
  $toggleBlockMediaNewWindow,
  $toggleIgnoreExternalLinkWarning,
  $toggleRateDownGuard,
} = slice.actions;

export default slice.reducer;
