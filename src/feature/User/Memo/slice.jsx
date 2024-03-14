import { createSlice } from '@reduxjs/toolkit';

import { deleteValue, getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  contextRange: 'nickname',
  variant: 'badge',
  memo: {},
};

function formatUpdater(storage, defaultValue) {
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
      return defaultValue;
  }
}

const initialState = {
  storage: getValue(Info.id, defaultStorage, formatUpdater),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $setContextRange(state, action) {
      state.storage.contextRange = action.payload;
    },
    $setVariant(state, action) {
      state.storage.variant = action.payload;
    },
    $setMemo(state, action) {
      const { user, memo } = action.payload;
      if (!memo.msg && !memo.color) {
        delete state.storage.memo[user];
        return;
      }

      state.storage.memo[user] = memo;
    },
    $updateMemoNick(state, action) {
      const { user, nick } = action.payload;
      state.storage.memo[user].nick = nick;
    },
    $setMemoList(state, action) {
      state.storage.memo = action.payload;
    },
  },
});

export const {
  $setContextRange,
  $setVariant,
  $setMemo,
  $updateMemoNick,
  $setMemoList,
} = slice.actions;

export default slice.reducer;
