import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';

import { TYPE_MINOR } from './func';
import Info from './FeatureInfo';

const defaultStorage = {
  lastVersion: GM_info.script.version,
  checkedVersion: GM_info.script.version,
  notiLevel: TYPE_MINOR,
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $setLastVersion(state, action) {
      state.storage.lastVersion = action.payload;
    },
    $setCheckedVersion(state, action) {
      state.storage.checkedVersion = action.payload;
    },
    $setNotiLevel(state, action) {
      state.storage.notiLevel = action.payload;
    },
  },
});

export const { $setLastVersion, $setCheckedVersion, $setNotiLevel } =
  slice.actions;

export default slice.reducer;
