import React, { useCallback, useState } from 'react';
import {
  Collapse,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import ColorPicker from 'component/ColorPicker';
import { useOpacity } from 'menu/ConfigMenu';

const PresetEditor = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function PresetEditor(
    { groupData, defaultPreset, preset, disabled, onChange },
    ref,
  ) {
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
              button
              divider={
                groupIndex < groupData.length - 1 ||
                (groupIndex === groupData.length - 1 && openGroup[groupKey])
              }
              onClick={handleOpen(groupKey)}
            >
              <ListItemText>{text}</ListItemText>
              <ListItemSecondaryAction>
                {openGroup[groupKey] ? <ExpandLess /> : <ExpandMore />}
              </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={openGroup[groupKey]}>
              <List disablePadding>
                {rows.map(({ key, primary, secondary }, colorIndex) => (
                  <ListItem
                    key={key}
                    divider={
                      groupIndex < groupData.length - 1 ||
                      colorIndex < rows.length - 1
                    }
                    disabled={disabled}
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

export default PresetEditor;
