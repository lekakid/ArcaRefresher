import { Fragment } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { List, MenuItem, Paper, Typography } from '@mui/material';

import { SelectRow } from 'component/ConfigMenu';
import { $setPosition } from 'menu/ArticleMenu/slice';

import Info from '../FeatureInfo';

const View = React.forwardRef((_props, ref) => {
  const { position } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow primary="메뉴 위치" value={position} action={$setPosition}>
            <MenuItem value="beforeHead">게시물 제목 전</MenuItem>
            <MenuItem value="afterHead">게시물 제목 후</MenuItem>
            <MenuItem value="none">사용 안 함</MenuItem>
          </SelectRow>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
