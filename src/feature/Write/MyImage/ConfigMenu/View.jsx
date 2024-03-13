import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, ListItemText, Paper, Typography } from '@mui/material';

import { BaseRow, SwitchRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import { $toggleEnabled, $toggleForceLoad } from '../slice';
import GalleryManager from './GalleryManager';

const View = React.forwardRef((_props, ref) => {
  const { enabled, imgList, forceLoad } = useSelector(
    (state) => state[Info.id].storage,
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="사용"
            value={enabled}
            action={$toggleEnabled}
          />
          <SwitchRow
            divider
            primary="자짤 강제로 덮어쓰기"
            secondary="작성하던 글이 있으면 강제로 덮어씁니다."
            value={forceLoad}
            action={$toggleForceLoad}
          />
          <BaseRow
            column="always"
            header={
              <ListItemText
                primary="자짤 목록"
                secondary="채널 slug와 같은 이름을 가진 폴더는 글 작성 시 이미지가 자동으로 첨부됩니다."
              />
            }
          >
            <GalleryManager gallery={imgList} />
          </BaseRow>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
