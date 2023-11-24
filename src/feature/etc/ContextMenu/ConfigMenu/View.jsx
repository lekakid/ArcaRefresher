import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';

import { KeyIcon } from 'component';
import { $setInteraction } from 'menu/ContextMenu/slice';

import { SelectRow } from 'component/config';
import Info from '../FeatureInfo';

const label = {
  r: {
    refresher: ['R Click'],
    browser: ['Shift', 'R Click'],
  },
  sr: {
    refresher: ['Shift', 'R Click'],
    browser: ['R Click'],
  },
  cr: {
    refresher: ['Ctrl', 'R Click'],
    browser: ['R Click'],
  },
};

const View = React.forwardRef((_props, ref) => {
  const { interactionType } = useSelector((state) => state[Info.ID].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            primary="메뉴 호출 방식"
            value={interactionType}
            action={$setInteraction}
          >
            <MenuItem value="r">R Click</MenuItem>
            <MenuItem value="sr">Shift + R Click</MenuItem>
            <MenuItem value="cr">Ctrl + R Click</MenuItem>
          </SelectRow>
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Paper variant="outlined">
                <List disablePadding>
                  <ListItem divider>
                    <ListItemText primary="리프레셔 메뉴" />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {label[interactionType].refresher.map(
                          (value, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <React.Fragment key={index}>
                              {index !== 0 && '+'}
                              <KeyIcon title={value} />
                            </React.Fragment>
                          ),
                        )}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="브라우저 메뉴" />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {label[interactionType].browser.map((value, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <React.Fragment key={index}>
                            {index !== 0 && '+'}
                            <KeyIcon title={value} />
                          </React.Fragment>
                        ))}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </ListItem>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
