import { createSelector } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

export const filterSelector = createSelector(
  (state) => state[Info.ID].storage.user,
  (state) => state[Info.ID].storage.keyword,
  (state) => state[Info.ID].storage.channel,
  (state) => state[Info.ID].storage.emoticon,
  (state, channelID) => state[Info.ID].storage.category[channelID],
  (user, keyword, channel, emotBundleList, category) => {
    const entries = Object.values(emotBundleList).reduce(
      (acc, { name, bundle, url }) => {
        acc.bundle.push(...bundle.map((id) => [id, name]));
        acc.url.push(...url.map((u) => [u, name]));
        return acc;
      },
      { bundle: [], url: [] },
    );

    const emoticon = {
      bundle: Object.fromEntries(entries.bundle),
      url: Object.fromEntries(entries.url),
    };

    return { user, keyword, channel, emoticon, category };
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
