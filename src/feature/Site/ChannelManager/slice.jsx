import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: false,
  groupList: [],
  channelInfoTable: {},
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
  navChannelInfo: {
    subs: [],
    main: [],
  },
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $toggleEnabled(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $addGroup(state, action) {
      const { name } = action.payload;
      state.storage.groupList.push(name);
      state.storage.groupList = state.storage.groupList.sort();
    },
    $renameGroup(state, action) {
      const { prev, next } = action.payload;
      const index = state.storage.groupList.indexOf(prev);
      if (index === -1) return; // ?

      state.storage.groupList.splice(index, 1, next);
      state.storage.channelInfoTable = Object.fromEntries(
        Object.entries(state.storage.channelInfoTable).map(
          ([channel, data]) => {
            const cIndex = data.groups.indexOf(prev);
            if (cIndex === -1) return [channel, data];

            data.groups.splice(cIndex, 1, next);
            return [channel, data];
          },
        ),
      );
    },
    $removeGroup(state, action) {
      const { name } = action.payload;
      state.storage.groupList = state.storage.groupList.filter(
        (f) => f !== name,
      );
      state.storage.channelInfoTable = Object.fromEntries(
        Object.entries(state.storage.channelInfoTable).map(
          ([channel, data]) => {
            const updatedGroups = data.groups.filter((t) => t !== name);
            return [channel, { ...data, groups: updatedGroups }];
          },
        ),
      );
    },
    $setChannelInfo(state, action) {
      const { id, info } = action.payload;
      state.storage.channelInfoTable[id] = info;
    },
    setNavChannelInfo(state, action) {
      state.navChannelInfo = action.payload;
    },
  },
});

export const {
  $toggleEnabled,
  $addGroup,
  $renameGroup,
  $removeGroup,
  $setChannelInfo,
  setNavChannelInfo,
} = slice.actions;

export default slice.reducer;
