import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Info from '../FeatureInfo';
import { $saveArticle } from '../slice';

export default function AutoSaver({ editor }) {
  const dispatch = useDispatch();
  const {
    storage: { autoSaveTime },
    currentSlot,
    loadOpen,
  } = useSelector((state) => state[Info.ID]);

  useEffect(() => {
    if (autoSaveTime === 0 || loadOpen) return undefined;
    if (!currentSlot) return undefined;

    const timer = setInterval(() => {
      const date = new Date();
      const title =
        editor.title.value || `${date.toLocaleString()}에 자동 저장됨`;
      const content = editor.content.html.get(true);

      dispatch($saveArticle({ slot: currentSlot, title, content }));
    }, autoSaveTime * 1000);

    return () => clearInterval(timer);
  }, [autoSaveTime, currentSlot, dispatch, editor, loadOpen]);

  return null;
}
