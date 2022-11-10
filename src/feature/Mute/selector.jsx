import { createSelector } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

export const emoticonFilterSelector = createSelector(
  [(state) => state[Info.ID].storage.emoticon],
  (emoticon) =>
    Object.values(emoticon).reduce(
      (acc, { bundle = [], url = [] }) => {
        acc.bundle.push(...bundle);
        acc.url.push(...url);
        return acc;
      },
      { bundle: [], url: [] },
    ),
);

export const emoticonTableSelector = createSelector(
  [(state) => state[Info.ID].storage.emoticon],
  (emoticon) =>
    Object.keys(emoticon).map((key) => ({
      id: key,
      name: emoticon[key].name,
      bundle: emoticon[key].bundle,
      url: emoticon[key].url,
    })),
);
