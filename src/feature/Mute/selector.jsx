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
    Object.entries(emoticon).map(([key, { name, bundle, url }]) => ({
      id: key,
      name,
      bundle,
      url,
    })),
);
