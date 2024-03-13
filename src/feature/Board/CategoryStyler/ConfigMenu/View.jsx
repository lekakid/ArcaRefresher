import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, List, ListItem, Paper, Typography } from '@mui/material';

import { useContent } from 'hooks/Content';

import Info from '../FeatureInfo';
import { $setCategoryStyle } from '../slice';
import CategoryRow from './CategoryRow';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { channel, category } = useContent();
  const color = useSelector(
    (state) => state[Info.id].storage.color[channel.id],
  );

  const handleChange = useCallback(
    (id, value) => {
      dispatch($setCategoryStyle({ channel: channel.id, category: id, value }));
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
                {category?.id2NameMap ? (
                  Object.entries(category.id2NameMap).map(
                    ([id, label], index) => (
                      <CategoryRow
                        key={id}
                        divider={index !== 0}
                        id={id}
                        label={label}
                        initValue={color?.[id]}
                        onChange={handleChange}
                      />
                    ),
                  )
                ) : (
                  <Grid item xs={12}>
                    <Typography align="center">
                      카테고리를 확인할 수 없습니다.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </ListItem>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
