import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useOpenState } from 'feature/Menu/ConfigMenu/hooks';
import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { useContent } from 'core/ContentCollector';

import useArcaShortKeyBlocker from './useArcaShortKeyBlocker';
import actionTable, { ACTIVE_ARTICLE, ACTIVE_BOARD } from './actionTable';
import keyFilter from './keyFilter';
import info from './info';

export default function ShortKey() {
  const setSnack = useSnackbarAlert();
  const content = useContent();
  const setBlocker = useArcaShortKeyBlocker();

  const configOpen = useOpenState();
  const { enabled, keyTable } = useSelector((state) => state[info.id].storage);

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

    setBlocker(true);

    const eventListener = (e) => {
      // MUI 컴포넌트 내에서
      if (e.target.closest('.MuiModal-root, .MuiPopper-root')) return;

      // 검색창 등 텍스트 입력칸
      if (e.target.matches('input, textarea, [contenteditable]')) return;

      // 조합키를 사용하는 경우
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

      // 단축키로서 사용을 허용하지 않는 키
      if (keyFilter.test(e.code)) return;

      // 단축키 기능 실행
      activeActionMap[e.code]?.(e, { content, setSnack });
    };

    document.addEventListener('keydown', eventListener);

    return () => {
      document.removeEventListener('keydown', eventListener);
      setBlocker(false);
    };
  }, [
    content,
    content.article,
    content.board,
    enabled,
    configOpen,
    keyTable,
    setBlocker,
    setSnack,
  ]);

  return null;
}
