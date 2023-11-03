import { createSelector } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

export const emoticonFilterSelector = createSelector(
  [(state) => state[Info.ID].storage.emoticon],
  (emoticon) => {
    const entries = Object.values(emoticon).reduce(
      (acc, { name, bundle, url }) => {
        acc.bundle.push(...bundle.map((id) => [id, name]));
        acc.url.push(...url.map((u) => [u, name]));
        return acc;
      },
      { bundle: [], url: [] },
    );

    return {
      bundle: Object.fromEntries(entries.bundle),
      url: Object.fromEntries(entries.url),
    };
  },
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
