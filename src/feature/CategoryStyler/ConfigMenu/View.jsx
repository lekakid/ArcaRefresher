import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { useContent } from 'util/ContentInfo';

import Info from '../FeatureInfo';
import { $setStyle } from '../slice';
import CategoryRow from './CategoryRow';

const styles = {
  root: {
    width: '100%',
  },
};

const View = React.forwardRef(({ classes }, ref) => {
  const dispatch = useDispatch();
  const { channel } = useContent();
  const {
    storage: { color },
  } = useSelector((state) => state[Info.ID]);
  const channelConfig = color[channel.ID];

  const handleChange = useCallback(
    (categoryId, value) => {
      const updateConfig = {
        ...channelConfig,
        [categoryId]: value,
      };
      dispatch($setStyle({ channel: channel.ID, color: updateConfig }));
    },
    [channel, channelConfig, dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText>색상 설정</ListItemText>
          </ListItem>
          <ListItem>
            <Paper className={classes.root} variant="outlined">
              <Grid container>
                {channel.category &&
                  Object.entries(channel.category).map(([id, label], index) => (
                    <CategoryRow
                      key={id}
                      divider={index !== 0}
                      id={id}
                      label={label}
                      initValue={channelConfig?.[id]}
                      onChange={handleChange}
                    />
                  ))}
              </Grid>
            </Paper>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default withStyles(styles)(View);
