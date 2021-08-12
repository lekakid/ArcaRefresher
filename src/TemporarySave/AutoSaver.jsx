import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MODULE_ID } from './ModuleInfo';
import { saveArticle } from './slice';

export default function AutoSaver() {
  const dispatch = useDispatch();
  const { loadDialogOpen, autoSaveTime, titleInput, editor } = useSelector(
    (state) => state[MODULE_ID],
  );

  useEffect(() => {
    if (!titleInput || !editor) return null;
    if (autoSaveTime === 0 || loadDialogOpen) return null;

    const timer = setInterval(() => {
      const date = new Date();
      const timestamp = date.getTime();
      const title =
        titleInput.value || `${date.toLocaleString()}에 자동 저장됨`;
      const content = editor.html.get(true);

      dispatch(saveArticle({ timestamp, title, content }));
    }, autoSaveTime * 1000);

    return () => clearInterval(timer);
  }, [autoSaveTime, dispatch, editor, loadDialogOpen, titleInput]);

  return null;
}
