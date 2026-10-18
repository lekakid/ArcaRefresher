import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, List, ListItem, Paper, Typography } from '@mui/material';

import { useContent } from 'hooks/Content';

import CategoryRow from './CategoryRow';
import { $setCategoryStyle } from '../slice';
import info from '../info';

function CategoryStyler() {
  const dispatch = useDispatch();
  const { channel, category } = useContent();
  const color = useSelector(
    (state) => state[info.id].storage.color[channel.id],
  );

  const handleChange = useCallback(
    (id, value) => {
      dispatch($setCategoryStyle({ channel: channel.id, category: id, value }));
    },
    [channel, dispatch],
  );

  return (
    <>
      <Typography variant="subtitle1">{info.name}</Typography>
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
                  <Grid size={{ xs: 12 }}>
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
    </>
  );
}

export default CategoryStyler;
