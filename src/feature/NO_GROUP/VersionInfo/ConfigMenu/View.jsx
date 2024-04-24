import { forwardRef, Fragment, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { useConfirm } from 'component';

import Info from '../FeatureInfo';
import { $setNotiLevel } from '../slice';
import { TYPE_MINOR, TYPE_NONE, TYPE_PATCH } from '../func';

const DONATION_TOSS_URL = 'https://toss.me/lekakid';

const View = forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const [confirm, ConfirmDialog] = useConfirm();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { notiLevel } = useSelector((state) => state[Info.id].storage);
  const [open, setOpen] = useState(false);

  const handleNotiLevel = useCallback(
    async (e) => {
      if (e.target.value === TYPE_NONE) {
        let result;

        result = await confirm({
          title: '알림 설정 재확인',
          content: `업데이트 소식을 알리지 않는다고 선택하신게 맞습니까?`,
          buttonList: [
            { label: '예', value: true },
            { label: '아니오', value: false, variant: 'contained' },
          ],
        });
        if (!result) return;

        result = await confirm({
          title: '알림 설정 재재확인',
          content: `귀하가 새로운 기능을 마주했을 때 문의 게시판에 가기 전에
          이것이 리프레셔 기능인지, 사이트에서 제공하는 기능인지
          직접 구분 못함에 동의합니까?
        `,
          buttonList: [
            { label: '예', value: false },
            { label: '아니오', value: true, variant: 'contained' },
          ],
        });
        if (!result) return;

        result = await confirm({
          title: '알림 설정 재재재확인',
          content: `앞선 재확인 절차의 문구를 잘 읽었음에 동의합니다.`,
          buttonList: [
            { label: '홬인', value: false },
            { label: '확인', value: true },
            { label: '획인', value: false },
            { label: '흭인', value: false, variant: 'contained' },
          ],
        });
        if (!result) return;
      }
      dispatch($setNotiLevel(e.target.value));
    },
    [confirm, dispatch],
  );

  const handleVisitChannel = useCallback(() => {
    GM_openInTab('https://arca.live/b/namurefresher');
  }, []);

  const handleVisitGithub = useCallback(() => {
    GM_openInTab('https://github.com/lekakid/ArcaRefresher');
  }, []);

  const handleVisitGithubSponsors = useCallback(() => {
    GM_openInTab('https://github.com/sponsors/lekakid');
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
            onChange={handleNotiLevel}
          >
            <MenuItem value={TYPE_NONE}>알리지 않음</MenuItem>
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
            header={<ListItemText primary="Github Sponsors" />}
            onClick={handleVisitGithubSponsors}
          >
            <OpenInNew />
          </BaseRow>
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
      <ConfirmDialog />
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
