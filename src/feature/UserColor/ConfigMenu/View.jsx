import React from 'react';
import { Box, List, ListItem, Paper, Typography } from '@material-ui/core';

import Info from '../FeatureInfo';

const View = React.forwardRef((_props, ref) => (
  <Box ref={ref}>
    <Typography variant="subtitle1">{Info.name}</Typography>
    <Paper>
      <List>
        <ListItem>
          <Typography>메모 기능과 통합되었습니다.</Typography>
        </ListItem>
      </List>
    </Paper>
  </Box>
));

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
