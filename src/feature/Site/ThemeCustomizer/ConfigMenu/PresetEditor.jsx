import { forwardRef, Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import ColorPicker from 'component/ColorPicker';
import { useOpacity } from 'menu/ConfigMenu';

const PresetEditor = forwardRef(
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
          <Fragment key={groupKey}>
            <ListItem
              disablePadding
              divider={
                groupIndex < groupData.length - 1 ||
                (groupIndex === groupData.length - 1 && openGroup[groupKey])
              }
              secondaryAction={
                openGroup[groupKey] ? <ExpandLess /> : <ExpandMore />
              }
            >
              <ListItemButton onClick={handleOpen(groupKey)}>
                <ListItemText>{text}</ListItemText>
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
                    secondaryAction={
                      <ColorPicker
                        disabled={disabled}
                        defaultColor={defaultPreset[key]}
                        color={preset[key]}
                        onOpen={() => setOpacity(0)}
                        onClose={() => setOpacity(1)}
                        onChange={(color) => handleChange(key, color)}
                      />
                    }
                  >
                    <ListItemText primary={primary} secondary={secondary} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Fragment>
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
