import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  variant: 'badge',
  memo: {},
};

const initialState = getValue(MODULE_ID, defaultConfigState);

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setVariant(state, action) {
      state.variant = action.payload;
      setValue(MODULE_ID, state);
    },
    setMemo(state, action) {
      const { user, memo } = action.payload;
      if (memo) {
        state.memo[user] = memo;
      } else {
        delete state.memo[user];
      }
      setValue(MODULE_ID, state);
    },
    setMemoList(state, action) {
      state.memo = action.payload;
      setValue(MODULE_ID, state);
    },
  },
});

export const { setVariant, setMemo, setMemoList } = slice.actions;

export default slice.reducer;
