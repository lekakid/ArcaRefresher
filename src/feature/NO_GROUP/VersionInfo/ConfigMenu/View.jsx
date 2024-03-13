import React, { Fragment, useCallback, useState } from 'react';
import {
  List,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogContent,
  useMediaQuery,
  ListItemText,
  MenuItem,
} from '@mui/material';
import { GitHub, Help, OpenInNew } from '@mui/icons-material';
import QRCode from 'react-qr-code';

import { BaseRow, SelectRow } from 'component/ConfigMenu';

import { useSelector } from 'react-redux';
import Info from '../FeatureInfo';
import { $setNotiLevel } from '../slice';
import { TYPE_MINOR, TYPE_PATCH } from '../func';

const DONATION_TOSS_URL = 'https://toss.me/lekakid';

const View = React.forwardRef((_props, ref) => {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { notiLevel } = useSelector((state) => state[Info.id].storage);
  const [open, setOpen] = useState(false);

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
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <BaseRow divider header={<ListItemText primary="버전" />}>
            <Typography>{GM_info.script.version}</Typography>
          </BaseRow>
          <SelectRow
            primary="업데이트 알림 수준"
            value={notiLevel}
            action={$setNotiLevel}
          >
            <MenuItem value={TYPE_MINOR}>기능 업데이트 마다</MenuItem>
            <MenuItem value={TYPE_PATCH}>핫픽스 업데이트 마다</MenuItem>
          </SelectRow>
        </List>
      </Paper>
      <Typography variant="subtitle2">문의</Typography>
      <Paper>
        <List disablePadding>
          <BaseRow
            divider
            header={<ListItemText primary="아카리프레셔 채널 (문의 접수)" />}
            onClick={handleVisitChannel}
          >
            <Help />
          </BaseRow>
          <BaseRow
            header={<ListItemText primary="Github" />}
            onClick={handleVisitGithub}
          >
            <GitHub />
          </BaseRow>
        </List>
      </Paper>
      <Typography variant="subtitle2">후원</Typography>
      <Paper>
        <List disablePadding>
          <BaseRow
            divider
            header={<ListItemText primary="Buy Me a Coffee" />}
            onClick={handleVisitCoffeeBuyMe}
          >
            <OpenInNew />
          </BaseRow>
          <BaseRow
            header={<ListItemText primary="토스아이디" />}
            onClick={handleVisitToss}
          >
            <OpenInNew />
          </BaseRow>
        </List>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Typography style={{ textAlign: 'center' }}>
            아래의 QR코드로 방문해주세요
          </Typography>
          <Box sx={{ padding: 2 }}>
            <QRCode value={DONATION_TOSS_URL} />
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
