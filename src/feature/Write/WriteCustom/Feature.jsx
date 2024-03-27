import { useSelector } from 'react-redux';
import { GlobalStyles, useMediaQuery } from '@mui/material';

import Info from './FeatureInfo';

/* eslint-disable react/prop-types */

function CategoryAlignStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '.article-write #article_write_form': {
          display: 'grid',
          gridTemplateAreas: `
            'category title'
            'prevent prevent'
          `,
          gridTemplateColumns: '150px 1fr',
          columnGap: 8,
          '& .category-select-wrap': {
            gridArea: 'category',
          },
          '& #formAgreePreventDelete': {
            gridArea: 'prevent',
          },
          '& .input-title-wrap': {
            gridArea: 'title',
            '& > input[name=title]': {
              fontSize: '.9em',
              padding: '.4em .8em',
            },
          },
          '& > .row': {
            marginBottom: 12,
          },
          '& > *': {
            gridColumn: '1 / 3',
          },
        },
      }}
    />
  );
}

function FixDarkModeWriteFormStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '.write-body .dark-theme': {
          '&.fr-box.fr-basic .fr-wrapper': {
            border: '1px solid var(--color-bd-outer)',
            borderBottom: 'none',
            background: 'var(--color-bg-body)',
          },
          '&.fr-box.fr-basic .fr-element': {
            color: 'var(--color-text)',
          },
          '& .fr-second-toolbar': {
            background: '#353535',
            border: '1px solid var(--color-bd-outer)',
            color: 'var(--color-text)',
          },
        },
      }}
    />
  );
}

/* eslint-enable react/prop-types */

export default function WriteCustom() {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const {
    // 모양
    categoryAlign,
    fixDarkModeWriteForm,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <>
      {/* 나중에 추가될 수도 있기도 하고 Eslint 경고창 띄우는거 싫어서 주석 한줄 넣음 */}
      {!mobile && <CategoryAlignStyles value={categoryAlign} />}
      <FixDarkModeWriteFormStyles value={fixDarkModeWriteForm} />
    </>
  );
}
