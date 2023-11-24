import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, List, ListItem, Paper, Typography } from '@mui/material';

import { useContent } from 'hooks/Content';

import Info from '../FeatureInfo';
import { $setCategoryStyle } from '../slice';
import CategoryRow from './CategoryRow';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { channel, board } = useContent();
  const color = useSelector(
    (state) => state[Info.ID].storage.color[channel.ID],
  );

  const handleChange = useCallback(
    (id, value) => {
      dispatch($setCategoryStyle({ channel: channel.ID, category: id, value }));
    },
    [channel, dispatch],
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <ListItem>
            <Paper sx={{ width: '100%' }} variant="outlined">
              <Grid container>
                {!board?.category && (
                  <Grid item xs={12}>
                    <Typography align="center">
                      카테고리를 확인할 수 없습니다.
                    </Typography>
                  </Grid>
                )}
                {board?.category &&
                  Object.entries(board.category).map(([id, label], index) => (
                    <CategoryRow
                      key={id}
                      divider={index !== 0}
                      id={id}
                      label={label}
                      initValue={color?.[id]}
                      onChange={handleChange}
                    />
                  ))}
              </Grid>
            </Paper>
          </ListItem>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
