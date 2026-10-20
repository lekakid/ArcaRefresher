import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useOpenState } from 'feature/Menu/ConfigMenu';
import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { useContent } from 'hooks/Content';

import actionTable, { ACTIVE_ARTICLE, ACTIVE_BOARD } from './actionTable';
import keyFilter from './keyFilter';
import info from './info';

export default function ShortKey() {
  const setSnack = useSnackbarAlert();
  const content = useContent();

  const configOpen = useOpenState();
  const { enabled, compatibilityMode, keyTable } = useSelector(
    (state) => state[info.id].storage,
  );

  useEffect(() => {
    if (!enabled) return undefined;
    if (configOpen) return undefined;

    const activeActionTable = actionTable.filter(({ active }) => {
      if (content.article) return active.includes(ACTIVE_ARTICLE);
      if (content.category) return active.includes(ACTIVE_BOARD);
      return false;
    });
    const keyMap = Object.fromEntries(
      keyTable.map(({ action, key }) => [action, key]),
    );

    const activeActionMap = Object.fromEntries(
      activeActionTable
        .map(({ action, defaultKey, callback }) => [
          keyMap[action] || defaultKey,
          callback,
        ])
        .filter(([key]) => !!key),
    );

    const eventListener = (e) => {
      // 검색창 등 텍스트 입력칸
      if (e.target.matches('input, textarea, [contenteditable]')) return;
      if (e.target.closest('.MuiModal-root, .MuiPopper-root')) return;

      // 조합키
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

      // 기타 기능
      if (keyFilter.test(e.code)) return;

      if ((compatibilityMode && activeActionMap[e.code]) || !compatibilityMode)
        e.stopPropagation();
      activeActionMap[e.code]?.(e, { content, setSnack });
    };

    document.addEventListener('keydown', eventListener, true);

    return () => {
      document.removeEventListener('keydown', eventListener, true);
    };
  }, [
    content,
    content.article,
    content.board,
    enabled,
    compatibilityMode,
    configOpen,
    keyTable,
    setSnack,
  ]);

  return null;
}
