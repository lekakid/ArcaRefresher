import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Collapse, List, MenuItem, Paper, Typography } from '@mui/material';

import { SelectRow, SwitchRow, TextFieldRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import {
  $setSpoofTitle,
  $toggleArticleNewWindow,
  $toggleBlockMediaNewWindow,
  $toggleRateDownGuard,
  $toggleComment,
  $toggleWideArea,
  $toggleIgnoreExternalLinkWarning,
  $toggleEnhancedArticleManage,
  $setAlternativeSubmitKey,
  $setSpoofFavicon,
  $setPresetFavicon,
} from '../slice';

const View = React.forwardRef((_props, ref) => {
  const {
    spoofTitle,
    presetFavicon,
    spoofFavicon,
    openArticleNewWindow,
    blockMediaNewWindow,
    ignoreExternalLinkWarning,
    ratedownGuard,
    foldComment,
    wideClickArea,
    alternativeSubmitKey,
    enhancedArticleManage,
  } = useSelector((state) => state[Info.ID].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <TextFieldRow
            divider
            primary="사이트 표시 제목 변경"
            secondary="공란일 시 변경하지 않습니다."
            value={spoofTitle}
            action={$setSpoofTitle}
          />
          <SelectRow
            divider
            primary="사이트 파비콘 변경"
            secondary="사이트 대표 아이콘을 다른 사이트로 변경합니다."
            value={presetFavicon}
            action={$setPresetFavicon}
          >
            <MenuItem value="">사용 안 함</MenuItem>
            <MenuItem value="google">구글</MenuItem>
            <MenuItem value="gmail">G Mail</MenuItem>
            <MenuItem value="naver">네이버</MenuItem>
            <MenuItem value="custom">커스텀</MenuItem>
          </SelectRow>
          <Collapse in={presetFavicon === 'custom'}>
            <TextFieldRow
              divider
              primary="커스텀 파비콘 URL"
              manualSave
              value={spoofFavicon}
              action={$setSpoofFavicon}
            />
          </Collapse>
          <SwitchRow
            divider
            primary="게시물 새 창에서 열기"
            secondary="게시판 화면에서 게시물을 클릭하면 새 창에서 열리게 합니다."
            value={openArticleNewWindow}
            action={$toggleArticleNewWindow}
          />
          <SwitchRow
            divider
            primary="이미지, 동영상 새 창 열기 방지"
            secondary="새로고침 후에 적용됩니다."
            value={blockMediaNewWindow}
            action={$toggleBlockMediaNewWindow}
          />
          <SwitchRow
            divider
            primary="외부 링크 오픈 시 경고 무시"
            secondary="새로고침 후에 적용됩니다."
            value={ignoreExternalLinkWarning}
            action={$toggleIgnoreExternalLinkWarning}
          />
          <SwitchRow
            divider
            primary="비추천 방지"
            secondary="비추천 버튼을 클릭하면 재확인 창이 표시됩니다."
            value={ratedownGuard}
            action={$toggleRateDownGuard}
          />
          <SwitchRow
            divider
            primary="댓글 접기"
            secondary="게시물 댓글을 접고 댓글 보기 버튼을 추가합니다."
            value={foldComment}
            action={$toggleComment}
          />
          <SwitchRow
            divider
            primary="넓은 답글 버튼 사용"
            secondary="댓글 어디를 클릭하든 답글창이 열립니다."
            value={wideClickArea}
            action={$toggleWideArea}
          />
          <SelectRow
            divider
            primary="댓글 작성키 변경"
            secondary="댓글 입력키를 변경합니다.(새로고침 필요)"
            value={alternativeSubmitKey}
            action={$setAlternativeSubmitKey}
          >
            <MenuItem value="">Enter</MenuItem>
            <MenuItem value="ctrlKey">Ctrl+Enter</MenuItem>
            <MenuItem value="shiftKey">Shift+Enter</MenuItem>
          </SelectRow>
          <SwitchRow
            primary="개선된 게시물 관리 사용"
            secondary="체크박스의 클릭 범위를 여유롭게 만들고 드래그로 한번에 선택할 수 있습니다."
            value={enhancedArticleManage}
            action={$toggleEnhancedArticleManage}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
