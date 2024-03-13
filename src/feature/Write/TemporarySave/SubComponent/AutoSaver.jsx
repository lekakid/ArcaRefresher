import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Info from '../FeatureInfo';
import { $addArticle } from '../slice';

function AutoSaver({ editor }) {
  const dispatch = useDispatch();

  const { autoSaveTime } = useSelector((state) => state[Info.id].storage);
  const { currentSlot, loadOpen } = useSelector((state) => state[Info.id]);

  useEffect(() => {
    if (autoSaveTime === 0 || loadOpen) return undefined;
    if (!currentSlot) return undefined;

    const timer = setInterval(() => {
      const date = new Date();
      const title =
        editor.title.value || `${date.toLocaleString()}에 자동 저장됨`;
      const content = editor.content.html.get(true);

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
