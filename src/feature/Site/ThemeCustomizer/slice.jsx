import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 3,
  enabled: false,
  current: '',
  theme: {},
};

function updater(storage, defaultValue) {
  if (!storage) return defaultValue;

  // version 0 => 3
  const version = storage?.version || 0;

  switch (version) {
    case 0:
    case 1:
    case 2: {
      // [from, to]
      const remapTable = [
        ['highlight-color', 'bg-highlight'],
        ['user-highlight', 'bg-highlight-user'],
        ['border-navbar', 'bd-navbar'],
        ['border-outer', 'bd-outer'],
        ['border-inner', 'bd-inner'],
        ['btn-hover', 'bd-btn-hover'],
        ['visited-article', 'article-visited'],
      ];
      const entries = Object.entries(storage.theme).map(([key, value]) => {
        remapTable.forEach(([from, to]) => {
          if (!value[to]) {
            value[to] = value[from];
            delete value[from];
          }
        });

        return [key, value];
      });

      const updatedStorage = { ...storage };
      updatedStorage.theme = Object.fromEntries(entries);
      updatedStorage.version = 3;

      return updatedStorage;
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
    $toggleEnable(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $setCurrent(state, action) {
      state.storage.current = action.payload;
    },
    $setPreset(state, action) {
      const { key, preset } = action.payload;
      if (preset) state.storage.theme[key] = preset;
      else delete state.storage.theme[key];
    },
    $renamePreset(state, action) {
      const { prev, next } = action.payload;
      state.storage.theme[next] = state.storage.theme[prev];
      delete state.storage.theme[prev];
    },
  },
});

export const { $toggleEnable, $setCurrent, $setPreset, $renamePreset } =
  slice.actions;

export default slice.reducer;
