import { forwardRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Popover } from '@mui/material';
import { ChromePicker } from 'react-color';
import { Delete } from '@mui/icons-material';

const Picker = forwardRef(
  ({ disabled, defaultColor, color, onOpen, onClose, onChange }, ref) => {
    const [innerColor, setInnerColor] = useState(defaultColor);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (e) => {
      onOpen?.();
      setAnchorEl(e.target);
    };

    const handleClose = () => {
      onClose?.();
      setAnchorEl(null);
    };

    const handleChange = useCallback(
      (c) => {
        onChange?.(c.hex);
        setInnerColor(c.hex);
      },
      [onChange],
    );

    const handleRemove = useCallback(() => {
      onChange?.(defaultColor || '');
      setInnerColor(defaultColor || '');
    }, [defaultColor, onChange]);

    return (
      <>
        <Button
          ref={ref}
          disabled={disabled}
          sx={{
            margin: 0.5,
            minWidth: 32,
            minHeight: 32,
            backgroundColor: color ?? innerColor,
            '&:hover': {
              backgroundColor: color ?? innerColor,
            },
          }}
          onClick={handleOpen}
        />
        <Popover
          open={!!anchorEl}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                padding: 1,
                backgroundColor: 'unset',
                zIndex: 2300,
              },
            },
          }}
          onClose={handleClose}
        >
          <ChromePicker color={color ?? innerColor} onChange={handleChange} />
          <IconButton
            size="small"
            sx={{
              marginTop: 0.5,
              backgroundColor: (theme) => theme.palette.background.default,
              boxShadow: (theme) => theme.shadows[2],
            }}
            onClick={handleRemove}
          >
            <Delete />
          </IconButton>
        </Popover>
      </>
    );
  },
);

Picker.defaultProps = {
  defaultColor: '',
};

Picker.propTypes = {
  disabled: PropTypes.bool,
  defaultColor: PropTypes.string,
  color: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
};

export default Picker;
