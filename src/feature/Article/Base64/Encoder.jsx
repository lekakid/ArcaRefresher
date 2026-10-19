import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { encode } from './func/base64';
import info from './info';

function Cipher() {
  const { enabled } = useSelector((state) => state[info.id].storage);

  // 글작성 인코딩 기능
  useEffect(() => {
    if (!enabled) return undefined;

    const handler = (e) => {
      if (!e.target.matches('input, textarea, [contenteditable]')) return;
      if (!(e.ctrlKey && e.code === 'Space')) return;

      e.preventDefault();

      (async () => {
        const selection = window.getSelection();
        let content = '';
        switch (selection.type) {
          case 'Range': {
            content = selection
              .toString()
              .replace(/[\u200B-\u200D\uFEFF]/g, '')
              .trim();
            break;
          }
          case 'Caret': {
            content = (await navigator.clipboard.readText())
              .replace(/[\u200B-\u200D\uFEFF]/g, '')
              .trim();
            break;
          }
          default:
            break;
        }

        const encoded = encode(content);

        const range = selection.getRangeAt(0);
        if (e.target.matches('input, textarea')) {
          const origin = e.target.value;
          const value =
            origin.substring(0, e.target.selectionStart) +
            encoded +
            origin.substring(e.target.selectionEnd);
          e.target.value = value;
          return;
        }

        if (selection.type === 'Range') {
          if (
            range.commonAncestorContainer.parentElement.matches('a') &&
            range.commonAncestorContainer.parentElement.textContent === content
          ) {
            range.commonAncestorContainer.parentElement.outerHTML = encoded;
            return;
          }
          range.deleteContents();
        }
        const node = document.createTextNode(encoded);
        range.insertNode(node);
      })();
    };

    document.addEventListener('keydown', handler, true);
    return () => {
      document.removeEventListener('keydown', handler, true);
    };
  }, [enabled]);

  return null;
}

export default Cipher;
