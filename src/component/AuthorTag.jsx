import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Fade, Paper, Popper } from '@mui/material';

const colorTable = {
  red: '#ec4545',
  green: '#258d25',
  blue: '#0a96f2',
};

function AuthorTag({ variant = 'badge', color, children }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // 내용 없으면 렌더 안함
  if (!children) return null;

  if (variant === 'badge') {
    return (
      <Box
        component="span"
        sx={{
          marginLeft: '4px',
          marginRight: '0 !important',
          padding: '1px 5px',
          borderRadius: '1em',
          bgcolor: color ? colorTable[color] : 'primary.main',
          color: 'primary.contrastText',
          fontSize: '0.85em',
        }}
      >
        {children}
      </Box>
    );
  }

  if (variant === 'text') {
    return (
      <Box
        component="span"
        sx={{
          marginLeft: '5px',
          marginRight: '0 !important',
          paddingY: '1px',
          color: colorTable[color],
        }}
      >{`[${children}]`}</Box>
    );
  }

  if (variant === 'popper') {
    return (
      <>
        <Box
          component="span"
          sx={{ marginLeft: 0.5 }}
          className="bi-plus-circle-fill"
          onFocus={(e) => setAnchorEl(e.target)}
          onBlur={() => setAnchorEl(null)}
          onMouseOver={(e) => setAnchorEl(e.target)}
          onMouseLeave={() => setAnchorEl(null)}
        />
        <Popper transition open={!!anchorEl} anchorEl={anchorEl}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} in={!!anchorEl}>
              <Paper variant="outlined" sx={{ padding: 1 }}>
                {children}
              </Paper>
            </Fade>
          )}
        </Popper>
      </>
    );
  }

  return null;
}

AuthorTag.propTypes = {
  variant: PropTypes.oneOf(['badge', 'text', 'popper']),
  color: PropTypes.string,
  children: PropTypes.node,
};

export default memo(AuthorTag);
