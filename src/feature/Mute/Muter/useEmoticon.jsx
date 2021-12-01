import { useEffect, useState } from 'react';

export default function useEmoticon(emoticon) {
  const [filter, setFilter] = useState({});

  useEffect(() => {
    setFilter(
      Object.values(emoticon).reduce(
        (acc, { bundle = [], url = [] }) => {
          acc.bundle.push(...bundle);
          acc.url.push(...url);
          return acc;
        },
        { bundle: [], url: [] },
      ),
    );
  }, [emoticon]);

  return filter;
}
