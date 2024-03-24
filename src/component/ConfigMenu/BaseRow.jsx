import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemButton, Stack, useMediaQuery } from '@mui/material';

const BaseRow = forwardRef(
  ({ divider, nested, column, header, children, onClick }, ref) => {
    const isColumn = useMediaQuery((theme) => {
      let value = column;
      if (!column) value = 1;
      if (column === 'always') value = 99999;
      return theme.breakpoints.down(value);
    });

    const content = (
      <Stack
        sx={{ width: '100%' }}
        direction={isColumn ? 'column' : 'row'}
        alignItems={isColumn ? 'flex-start' : 'center'}
      >
        <Stack
          sx={{ width: '100%' }}
          direction="row"
          justifyContent="space-between"
        >
          {header}
        </Stack>
        <Stack
          sx={isColumn ? { width: '100%' } : undefined}
          alignItems="center"
        >
          {children}
        </Stack>
      </Stack>
    );

    return (
      <ListItem
        ref={ref}
        disablePadding={!!onClick}
        divider={divider}
        sx={
          !onClick && nested
            ? {
                paddingLeft: 4,
              }
            : undefined
        }
      >
        {onClick ? (
          <ListItemButton
            sx={
              onClick && nested
                ? {
                    paddingLeft: 4,
                  }
                : undefined
            }
            onClick={onClick}
          >
            {content}
          </ListItemButton>
        ) : (
          content
        )}
      </ListItem>
    );
  },
);

const RowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  column: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'always']),
  header: PropTypes.element,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

BaseRow.propTypes = RowPropTypes;
export default BaseRow;
