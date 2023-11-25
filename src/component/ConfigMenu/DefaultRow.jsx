import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';

const DefaultRow = React.forwardRef(
  (
    {
      divider,
      nested,
      direction = 'row',
      primary,
      secondary,
      children,
      onClick,
    },
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

const RowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  direction: PropTypes.oneOf(['row', 'column']),
  primary: PropTypes.node,
  secondary: PropTypes.node,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

DefaultRow.propTypes = RowPropTypes;
export default DefaultRow;
