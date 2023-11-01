import React, { useCallback, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogContent,
  useMediaQuery,
} from '@material-ui/core';
import { GitHub, Help, OpenInNew } from '@material-ui/icons';
import QRCode from 'react-qr-code';

import Info from '../FeatureInfo';

const DONATION_TOSS_URL = 'https://toss.me/lekakid';

const View = React.forwardRef((_props, ref) => {
  const [open, setOpen] = useState(false);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleVisitChannel = useCallback(() => {
    GM_openInTab('https://arca.live/b/namurefresher');
  }, []);

  const handleVisitGithub = useCallback(() => {
    GM_openInTab('https://github.com/lekakid/ArcaRefresher');
  }, []);

  const handleVisitCoffeeBuyMe = useCallback(() => {
    GM_openInTab('https://www.buymeacoffee.com/kinglekakid');
  }, []);

  const handleVisitToss = useCallback(() => {
    if (mobile) {
      GM_openInTab(DONATION_TOSS_URL);
      return;
    }
    setOpen(true);
  }, [mobile]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <ListItem divider>
            <ListItemText primary="버전" />
            <ListItemSecondaryAction>
              <Typography>{GM_info.script.version}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleVisitChannel}>
            <ListItemText primary="아카리프레셔 채널 (문의 접수)" />
            <ListItemSecondaryAction>
              <Help />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleVisitGithub}>
            <ListItemText primary="Github" />
            <ListItemSecondaryAction>
              <GitHub />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      <Typography variant="subtitle2">후원</Typography>
      <Paper>
        <List disablePadding>
          <ListItem divider button onClick={handleVisitCoffeeBuyMe}>
            <ListItemText primary="Buy Me a Coffee" />
            <ListItemSecondaryAction>
              <OpenInNew />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleVisitToss}>
            <ListItemText primary="토스아이디" />
            <ListItemSecondaryAction>
              <OpenInNew />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Typography style={{ textAlign: 'center' }}>
            아래의 QR코드로 방문해주세요
          </Typography>
          <Box padding={2}>
            <QRCode value={DONATION_TOSS_URL} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
