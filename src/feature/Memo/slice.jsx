import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  variant: 'badge',
  memo: {},
};

const initialState = {
  storage: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    setVariant(state, action) {
      state.storage.variant = action.payload;
    },
    setMemo(state, action) {
      const { user, memo } = action.payload;
      if (memo) {
        state.storage.memo[user] = memo;
      } else {
        delete state.storage.memo[user];
      }
    },
    setMemoList(state, action) {
      state.storage.memo = action.payload;
    },
  },
});

export const { setVariant, setMemo, setMemoList } = slice.actions;

export default slice.reducer;
