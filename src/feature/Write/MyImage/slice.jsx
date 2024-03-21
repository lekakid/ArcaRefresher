import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  enabled: true,
  imgList: { _shared_: [] },
  forceLoad: false,
};

function formatUpdater(storage, defaultValue) {
  if (!storage) return defaultValue;

  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      const imgList = Object.fromEntries(
        Object.entries(storage.imgList).map(([channelKey, images]) => [
          channelKey,
          images.map((url) => ({ url, memo: '' })),
        ]),
      );

      const updateStorage = { ...storage };
      updateStorage.imgList = imgList;
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
    $toggleEnabled(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $toggleForceLoad(state) {
      state.storage.forceLoad = !state.storage.forceLoad;
    },
    $addImage(state, action) {
      const { folder, image } = action.payload;
      state.storage.imgList[folder].push(image);
    },
    $removeImage(state, action) {
      const { folder, image } = action.payload;
      state.storage.imgList[folder] = state.storage.imgList[folder].filter(
        (i) => i.url !== image.url,
      );
    },
    $setImageList(state, action) {
      const { folder, list } = action.payload;
      state.storage.imgList[folder] = list;
    },
    $editImage(state, action) {
      const { folder, image } = action.payload;
      state.storage.imgList[folder] = state.storage.imgList[folder].map((i) =>
        i.url === image.url ? image : i,
      );
    },
    $addFolder(state, action) {
      const folder = action.payload;
      state.storage.imgList[folder] = [];
    },
    $removeFolder(state, action) {
      const folder = action.payload;
      delete state.storage.imgList[folder];
    },
    $setFolderData(state, action) {
      const { folder, list } = action.payload;
      state.storage.imgList[folder] = list;
    },
  },
});

export const {
  $toggleEnabled,
  $toggleForceLoad,
  $addImage,
  $removeImage,
  $setImageList,
  $addFolder,
  $removeFolder,
  $setFolderData,
} = slice.actions;

export default slice.reducer;
