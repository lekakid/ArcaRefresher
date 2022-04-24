import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  checkedVersion: '',
};

const initialState = {
  ...defaultConfigState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    updateCheckedVersion(state) {
      // eslint-disable-next-line camelcase
      state.checkedVersion = GM_info.script.version;
      GM_setValue(MODULE_ID, state);
    },
  },
});

export const { updateCheckedVersion } = slice.actions;

export default slice.reducer;
