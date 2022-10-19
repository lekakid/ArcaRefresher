import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  checkedVersion: '',
};

const initialState = {
  storage: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    updateCheckedVersion(state) {
      // eslint-disable-next-line camelcase
      state.storage.checkedVersion = GM_info.script.version;
    },
  },
});

export const { updateCheckedVersion } = slice.actions;

export default slice.reducer;
