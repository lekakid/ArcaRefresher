import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  enabled: false,
  current: '',
  theme: {},
};

function formatUpdater(storage, defaultValue) {
  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      const entries = Object.entries(storage.theme).map(([key, value]) => {
        value['bg-highlight'] = value['highlight-color'];
        delete value['highlight-color'];

        value['bg-highlight-user'] = value['user-highlight'];
        delete value['user-highlight'];

        return [key, value];
      });

      const updatedStorage = { ...storage };
      updatedStorage.theme = Object.fromEntries(entries);
      updatedStorage.version = 1;

      return updatedStorage;
    }
    default:
      console.warn('지원하지 않는 버전 데이터입니다.', storage);
      return defaultValue;
  }
}

const initialState = {
  storage: getValue(Info.ID, defaultStorage, formatUpdater),
};

export const slice = createSlice({
  name: Info.ID,
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
