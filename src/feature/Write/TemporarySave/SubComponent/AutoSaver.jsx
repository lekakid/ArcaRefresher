import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import info from '../info';
import { $addArticle } from '../slice';

function AutoSaver({ editor }) {
  const dispatch = useDispatch();

  const { autoSaveTime } = useSelector((state) => state[info.id].storage);
  const { currentSlot, loadOpen } = useSelector((state) => state[info.id]);

  useEffect(() => {
    if (autoSaveTime === 0 || loadOpen) return undefined;
    if (!currentSlot) return undefined;

    let lastTitle;
    let lastContent;
    const timer = setInterval(() => {
      const rawTitle = editor.title.value;
      const content = editor.content.html.get(true);
      if (rawTitle === lastTitle && content === lastContent) return;
      lastTitle = rawTitle;
      lastContent = content;

      const date = new Date();
      const title = rawTitle || `${date.toLocaleString()}에 자동 저장됨`;

      dispatch($addArticle({ slot: currentSlot, title, content }));
    }, autoSaveTime * 1000);

    return () => clearInterval(timer);
  }, [autoSaveTime, currentSlot, dispatch, editor, loadOpen]);

  return null;
}

AutoSaver.propTypes = {
  editor: PropTypes.object,
};

export default AutoSaver;
