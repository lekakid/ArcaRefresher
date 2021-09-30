import React, { useCallback, useRef } from 'react';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { saveAs } from 'file-saver';

import { importValues, exportValues } from 'core/gm';
import { ID, NAME } from './meta';

function DataManagement() {
  const inputRef = useRef();
  const handleImport = useCallback(() => {
    inputRef.current.click();
  }, []);

  const handleFileSelect = useCallback((e) => {
    (async () => {
      try {
        const path = e.target.files[0];
        const data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsText(path);
        });
        importValues(data);
        // TODO: 설정 데이터 구성 변경 이후 즉시 반영하도록 수정
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleExport = useCallback(() => {
    const data = exportValues();
    const file = new Blob([data], { type: 'text/plain' });
    saveAs(file, 'settings.txt');
  }, []);

  return (
    <>
      <Typography variant="subtitle1">{NAME}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleImport}>
            <input
              ref={inputRef}
              type="file"
              accept="text/plain"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <ListItemText primary="설정 가져오기" />
            <ListItemSecondaryAction>
              <Launch />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleExport}>
            <ListItemText primary="설정 내보내기" />
            <ListItemSecondaryAction>
              <Launch />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}

DataManagement.displayName = `ConfigMenu(${ID})`;
export default DataManagement;
