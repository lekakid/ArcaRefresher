import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import ColorPicker from 'component/ColorPicker';
import { useOpacity } from 'menu/ConfigMenu';

const PresetEditor = React.forwardRef(
  ({ disabled, groupData, defaultPreset, preset, onChange }, ref) => {
    const [openGroup, setOpenGroup] = useState(() => ({}));
    const setOpacity = useOpacity();

    const handleOpen = useCallback(
      (key) => () => {
        setOpenGroup((prev) => ({ ...prev, [key]: !prev[key] }));
      },
      [],
    );

    const handleChange = useCallback(
      (key, color) => {
        const nextPreset = { ...preset };
        nextPreset[key] = color;
        onChange?.(nextPreset);
      },
      [onChange, preset],
    );

    return (
      <List ref={ref} disablePadding>
        {groupData.map(({ key: groupKey, text, rows }, groupIndex) => (
          <React.Fragment key={groupKey}>
            <ListItem
              disablePadding
              divider={
                groupIndex < groupData.length - 1 ||
                (groupIndex === groupData.length - 1 && openGroup[groupKey])
              }
            >
              <ListItemButton onClick={handleOpen(groupKey)}>
                <ListItemText>{text}</ListItemText>
                <ListItemSecondaryAction>
                  {openGroup[groupKey] ? <ExpandLess /> : <ExpandMore />}
                </ListItemSecondaryAction>
              </ListItemButton>
            </ListItem>
            <Collapse in={openGroup[groupKey]}>
              <List disablePadding>
                {rows.map(({ key, primary, secondary }, colorIndex) => (
                  <ListItem
                    key={key}
                    sx={
                      disabled
                        ? (theme) => ({
                            opacity: theme.palette.action.disabledOpacity,
                          })
                        : undefined
                    }
                    divider={
                      groupIndex < groupData.length - 1 ||
                      colorIndex < rows.length - 1
                    }
                  >
                    <ListItemText primary={primary} secondary={secondary} />
                    <ListItemSecondaryAction>
                      <ColorPicker
                        disabled={disabled}
                        defaultColor={defaultPreset[key]}
                        color={preset[key]}
                        onOpen={() => setOpacity(0)}
                        onClose={() => setOpacity(1)}
                        onChange={(color) => handleChange(key, color)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    );
  },
);

PresetEditor.propTypes = {
  disabled: PropTypes.bool,
  groupData: PropTypes.array,
  defaultPreset: PropTypes.object,
  preset: PropTypes.object,
  onChange: PropTypes.func,
};

export default PresetEditor;
