import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  Paper,
  Typography,
  Box,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
} from '@mui/material';

import { SwitchRow } from 'component/ConfigMenu';
import { KeyIcon } from 'component';
import Info from '../FeatureInfo';
import {
  $toggleAutoDecode,
  $toggleClipboardDecode,
  $toggleEnabled,
} from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { enabled, autoDecode, clipboardDecode } = useSelector(
    (state) => state[Info.ID].storage,
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            primary="사용"
            seconday="변경 시 적용에 새로고침 필요"
            value={enabled}
            action={$toggleEnabled}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">디코딩</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="자동 복호화"
            secondary="원문이 링크인 코드를 자동으로 복호화합니다."
            value={autoDecode}
            action={$toggleAutoDecode}
          />
          <SwitchRow
            primary="복사된 텍스트 복호화"
            secondary="복사한 텍스트가 복호화 될 것 같으면 맞는 메뉴를 보여줍니다."
            value={clipboardDecode}
            action={$toggleClipboardDecode}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">인코딩</Typography>
      <Paper>
        <List disablePadding>
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Paper variant="outlined">
                <List disablePadding>
                  <ListItem>
                    <ListItemText primary="인코딩" />
                    <ListItemSecondaryAction>
                      <Stack direction="row">
                        <KeyIcon title="Ctrl" />
                        +
                        <KeyIcon title="Space" />
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </ListItem>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
