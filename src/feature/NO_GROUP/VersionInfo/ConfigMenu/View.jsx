import { GM_info, GM_openInTab } from '$';
import { forwardRef, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  Paper,
  Typography,
  ListItemText,
  MenuItem,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpIcon from '@mui/icons-material/Help';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { BaseRow, SelectRow } from 'component/ConfigMenu';
import { useConfirm } from 'component';

import info from '../info';
import { $setNotiLevel } from '../slice';
import { TYPE_MINOR, TYPE_NONE, TYPE_PATCH, parse, join } from '../func';

const View = forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const [confirm, ConfirmDialog] = useConfirm();

  const { notiLevel } = useSelector((state) => state[info.id].storage);

  const handleChangeLog = useCallback(() => {
    if (GM_info.version.includes('nightly')) {
      window.open('https://github.com/lekakid/ArcaRefresher/commits/develop/');
      return;
    }

    const url =
      'https://arca.live/b/namurefresher?category=%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8&target=title&keyword=';
    const version = parse(GM_info.script.version);
    version.patch = '*';
    window.open(`${url}${join(version)}`);
  }, []);

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

  const handleVisitCoffeeBuyMe = useCallback(() => {
    GM_openInTab('https://www.buymeacoffee.com/kinglekakid');
  }, []);

  const handleVisitGithubSponsors = useCallback(() => {
    GM_openInTab('https://github.com/sponsors/lekakid');
  }, []);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{info.name}</Typography>
      <Paper>
        <List disablePadding>
          <BaseRow
            divider
            header={<ListItemText primary="버전" />}
            onClick={handleChangeLog}
          >
            <Box sx={{ minWidth: 160, textAlign: 'right' }}>
              <Typography>{GM_info.script.version}</Typography>
            </Box>
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
            <HelpIcon />
          </BaseRow>
          <BaseRow
            header={<ListItemText primary="Github" />}
            onClick={handleVisitGithub}
          >
            <GitHubIcon />
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
            <OpenInNewIcon />
          </BaseRow>
          <BaseRow
            header={<ListItemText primary="Github Sponsors" />}
            onClick={handleVisitGithubSponsors}
          >
            <OpenInNewIcon />
          </BaseRow>
        </List>
      </Paper>
      <ConfirmDialog />
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${info.id})`;
export default View;
