import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MODULE_ID } from '../ModuleInfo';
import { saveArticle } from '../slice';

export default function AutoSaver({ editor }) {
  const dispatch = useDispatch();
  const { loadOpen, autoSaveTime } = useSelector((state) => state[MODULE_ID]);

  useEffect(() => {
    if (autoSaveTime === 0 || loadOpen) return null;

    const timer = setInterval(() => {
      const date = new Date();
      const timestamp = date.getTime();
      const title =
        editor.title.value || `${date.toLocaleString()}에 자동 저장됨`;
      const content = editor.content.html.get(true);

      dispatch(saveArticle({ timestamp, title, content }));
    }, autoSaveTime * 1000);

    return () => clearInterval(timer);
  }, [autoSaveTime, dispatch, editor, loadOpen]);

  return null;
}
