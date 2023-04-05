import { createSlice } from '@reduxjs/toolkit';

import { deleteValue, getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  variant: 'badge',
  memo: {},
};

function formatUpdater(storage) {
  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      const memo = Object.fromEntries(
        Object.entries(storage.memo).map(([key, msg]) => [key, { msg }]),
      );
      const data = getValue('UserColor');
      if (data) {
        Object.entries(data.color).forEach(([key, color]) => {
          (memo[key] ??= {}).color = color;
        });
        deleteValue('UserColor');
      }

      const updateStorage = { ...storage };
      updateStorage.memo = memo;
      updateStorage.version = 1;
      return updateStorage;
    }
    default:
      console.warn('지원하지 않는 버전 데이터입니다.', storage);
      return {};
  }
}

const initialState = {
  storage: getValue(Info.ID, defaultStorage, formatUpdater),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $setVariant(state, action) {
      state.storage.variant = action.payload;
    },
    $setMemo(state, action) {
      const { user, memo } = action.payload;
      if (memo) {
        state.storage.memo[user] = memo;
      } else {
        delete state.storage.memo[user];
      }
    },
    $setMemoList(state, action) {
      state.storage.memo = action.payload;
    },
  },
});

export const { $setVariant, $setMemo, $setMemoList } = slice.actions;

export default slice.reducer;
