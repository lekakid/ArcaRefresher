import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';

const AUTO_REMOVE_USER = { key: 'autoRemoveUser', defaultValue: [] };
const AUTO_REMOVE_KEYWORD = { key: 'autoRemoveKeyword', defaultValue: [] };
const USE_AUTO_REMOVER_TEST = { key: 'useAutoRemoverTest', defaultValue: true };

const initialState = {
  users: getValue(AUTO_REMOVE_USER),
  keywords: getValue(AUTO_REMOVE_KEYWORD),
  testMode: getValue(USE_AUTO_REMOVER_TEST),
};

export const slice = createSlice({
  name: 'ArticleRemover',
  initialState,
  reducers: {
    setUser(state, action) {
      state.users = action.payload;
      setValue(AUTO_REMOVE_USER, action.payload);
    },
    setKeyword(state, action) {
      state.keywords = action.payload;
      setValue(AUTO_REMOVE_KEYWORD, action.payload);
    },
    setTestMode(state, action) {
      state.testMode = action.payload;
      setValue(USE_AUTO_REMOVER_TEST, action.payload);
    },
  },
});

export const { setUser, setKeyword, setTestMode } = slice.actions;

export default slice.reducer;
