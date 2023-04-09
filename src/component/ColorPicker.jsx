import React, { useCallback, useState } from 'react';
import { Button, IconButton, Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { ChromePicker } from 'react-color';
import { Delete } from '@material-ui/icons';

const styles = (theme) => ({
  pickerButton: {
    width: 32,
    height: 32,
    minWidth: 32,
    minHeight: 32,
    margin: 4,
  },
  pickerContainer: {
    padding: 8,
    backgroundColor: 'unset',
    border: 'unset',
  },
  removeButton: {
    marginTop: 4,
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[2],
  },
});

const Picker = React.forwardRef(
  ({ classes, disabled, color, onChange }, ref) => {
    const [innerColor, setInnerColor] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleChange = useCallback(
      (c) => {
        onChange?.(c.hex);
        setInnerColor(c.hex);
      },
      [onChange],
    );

    const handleRemove = useCallback(() => {
      onChange?.('');
      setInnerColor('');
    }, [onChange]);

    return (
      <>
        <Button
          ref={ref}
          variant="outlined"
          disabled={disabled}
          style={{ background: color || innerColor }}
          className={classes.pickerButton}
          onClick={(e) => setAnchorEl(e.target)}
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
          PaperProps={{
            classes: { root: classes.pickerContainer },
            variant: 'outlined',
          }}
          style={{
            zIndex: 2300,
          }}
          onClose={() => setAnchorEl(null)}
        >
          <ChromePicker color={innerColor} onChange={handleChange} />
          <IconButton
            size="small"
            className={classes.removeButton}
            onClick={handleRemove}
          >
            <Delete />
          </IconButton>
        </Popover>
      </>
    );
  },
);

export default withStyles(styles)(Picker);
