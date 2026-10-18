import { useSelector } from 'react-redux';
import { Collapse, List, Paper, Typography } from '@mui/material';

import { SwitchRow } from 'feature/Menu/ConfigMenu/component';

import {
  $toggleBlockAll,
  $toggleBlockDeleted,
  $toggleBlockReported,
} from '../slice';
import info from '../info';

function MediaBlocker() {
  const { blockAll, blockDeleted, blockReported } = useSelector(
    (state) => state[info.id].storage,
  );

  return (
    <>
      <Typography variant="subtitle1">{info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="모든 게시물의 이미지 차단"
            value={blockAll}
            action={$toggleBlockAll}
          />
          <Collapse in={!blockAll}>
            <SwitchRow
              divider
              primary="삭제된 게시물 이미지 차단"
              secondary="채널 관리자 전용"
              value={blockDeleted}
              action={$toggleBlockDeleted}
            />
            <SwitchRow
              primary="신고된 게시물 이미지 차단"
              secondary="채널 관리자 전용, 이동 전 페이지가 신고 목록 일 때 동작합니다."
              value={blockReported}
              action={$toggleBlockReported}
            />
          </Collapse>
        </List>
      </Paper>
    </>
  );
}

export default MediaBlocker;
