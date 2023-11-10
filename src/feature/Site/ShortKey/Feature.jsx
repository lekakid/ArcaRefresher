import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useOpenState } from 'menu/ConfigMenu';
import { useSnackbarAlert } from 'menu/SnackbarAlert';

import { useContent } from 'hooks/Content';
import actionTable from './actionTable';
import keyFilter from './keyFilter';
import Info from './FeatureInfo';

export default function ShortKey() {
  const setSnack = useSnackbarAlert();
  const content = useContent();

  const configOpen = useOpenState();
  const { enabled, keyTable } = useSelector((state) => state[Info.ID].storage);

  useEffect(() => {
    if (!enabled) return undefined;
    if (configOpen) return undefined;

    const activeActionTable = actionTable.filter(({ active }) => {
      if (content.article) return active.indexOf('article') > -1;
      if (content.board) return active.indexOf('board') > -1;
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

      // 조합키
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

      // 기타 기능
      if (keyFilter.test(e.code)) return;

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
    configOpen,
    keyTable,
    setSnack,
  ]);

  return null;
}
