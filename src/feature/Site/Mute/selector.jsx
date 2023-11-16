import { createSelector } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

export const filterSelector = createSelector(
  (state) => state[Info.ID].storage.user,
  (state) => state[Info.ID].storage.keyword,
  (state) => state[Info.ID].storage.channel,
  (state) => state[Info.ID].storage.emoticon,
  (state, channelID) => state[Info.ID].storage.category[channelID],
  (userList, keywordList, channelList, emotMap, categoryOpt) => {
    const entries = Object.values(emotMap).reduce(
      (acc, { name, bundle, url }) => {
        acc.bundle.push(...bundle.map((id) => [id, name]));
        acc.url.push(...url.map((u) => [u, name]));
        return acc;
      },
      { bundle: [], url: [] },
    );

    const emotList = {
      bundle: Object.fromEntries(entries.bundle),
      url: Object.fromEntries(entries.url),
    };

    return { userList, keywordList, channelList, emotList, categoryOpt };
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
