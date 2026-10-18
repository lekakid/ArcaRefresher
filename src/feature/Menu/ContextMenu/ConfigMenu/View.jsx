import { Fragment, memo } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';

import { KeyIcon } from 'component';
import { SelectRow } from 'feature/Menu/ConfigMenu/component';
import { $setInteraction } from '../slice';

import info from '../info';

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
  const { interactionType } = useSelector((state) => state[info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{info.name}</Typography>
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
                  <ListItem
                    divider
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {label[interactionType].refresher.map(
                          (value, index) => (
                            <React.Fragment key={index}>
                              {index !== 0 && '+'}
                              <KeyIcon title={value} />
                            </React.Fragment>
                          ),
                        )}
                      </Box>
                    }
                  >
                    <ListItemText primary="리프레셔 메뉴" />
                  </ListItem>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {label[interactionType].browser.map((value, index) => (
                          <React.Fragment key={index}>
                            {index !== 0 && '+'}
                            <KeyIcon title={value} />
                          </React.Fragment>
                        ))}
                      </Box>
                    }
                  >
                    <ListItemText primary="브라우저 메뉴" />
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

View.displayName = `ConfigMenuView(${info.id})`;
export default memo(View);
