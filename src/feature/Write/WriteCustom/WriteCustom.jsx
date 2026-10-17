import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import store from 'core/store';

import info from './info';

const styleEl = document.createElement('style');
document.body.append(styleEl);

function applyStyle(storage) {
  const { categoryAlign, fixDarkModeWriteForm } = storage;

  const styles = [];

  // 카테고리 선택 콤보박스 모양 개선 (모바일 제외)
  if (categoryAlign) {
    styles.push(`
      @media screen and (min-width: 1200px) {
        .article-write #article_write_form {
          display: grid;
          grid-template-areas:
            'category title'
            'prevent prevent';
          grid-template-columns: 150px 1fr;
          column-gap: 8px;
        }

        .article-write #article_write_form .category-select-wrap { grid-area: category; }
        .article-write #article_write_form #formAgreePreventDelete { grid-area: prevent; }
        .article-write #article_write_form .input-title-wrap { grid-area: title; }
        .article-write #article_write_form .input-title-wrap > input[name=title] { font-size: .9em; padding: .4em .8em; }
        .article-write #article_write_form > .row { margin-bottom: 12px; }
        .article-write #article_write_form > * { grid-column: 1 / 3; }
      }
    `);
  }

  // 다크모드에서 글작성 폼이 흰색으로 나오는 문제 강제 수정
  if (fixDarkModeWriteForm) {
    styles.push(`
      .write-body .dark-theme.fr-box.fr-basic .fr-wrapper {
        border: 1px solid var(--color-bd-outer); border-bottom: none; background: var(--color-bg-body);
      }
      .write-body .dark-theme.fr-box.fr-basic .fr-element {
        color: var(--color-text);
      }
      .write-body .dark-theme .fr-second-toolbar {
        background: #353535; border: 1px solid var(--color-bd-outer); color: var(--color-text);
      }
      
    `);
  }

  styleEl.textContent = styles.join('\n\n');
}
applyStyle(store.getState()[info.id].storage);

export default function WriteCustom() {
  const { ...storage } = useSelector((state) => state[info.id].storage);

  // 스타일 적용
  useLayoutEffect(() => {
    applyStyle(storage);
  }, [storage]);

  return null;
}
