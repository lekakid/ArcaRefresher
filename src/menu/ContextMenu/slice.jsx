import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  enabled: true,
};

const initialState = {
  config: {
    ...defaultConfigState,
    ...GM_getValue(MODULE_ID),
  },
  open: false,
  snack: false,
  snackTime: null,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.config.enabled = !state.config.enabled;
      GM_setValue(MODULE_ID, state.config);
    },
    setOpen(state) {
      state.open = true;
    },
    setClose(state) {
      state.open = false;
    },
    setContextSnack(state, action) {
      const { msg, time } = action.payload;
      state.snack = msg;
      state.snackTime = time || null;
    },
  },
});

export const { toggleEnable, setOpen, setClose, setContextSnack } =
  slice.actions;

export default slice.reducer;
