import React from 'react';
import { ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';

const DefaultRow = React.forwardRef(
  (
    { divider, nested, direction, primary, secondary, children, onClick },
    ref,
  ) => {
    const stack = (
      <Stack
        sx={{ width: '100%' }}
        direction={direction}
        alignItems={direction === 'column' ? 'flex-start' : 'center'}
      >
        {primary && <ListItemText primary={primary} secondary={secondary} />}
        {children}
      </Stack>
    );

    return (
      <ListItem
        ref={ref}
        disablePadding={!!onClick}
        divider={divider}
        sx={
          nested && {
            paddingLeft: 4,
          }
        }
      >
        {onClick && <ListItemButton onClick={onClick}>{stack}</ListItemButton>}
        {!onClick && stack}
      </ListItem>
    );
  },
);

DefaultRow.defaultProps = {
  direction: 'row',
};

export default DefaultRow;
