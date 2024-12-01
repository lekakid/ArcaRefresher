import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography } from '@mui/material';

import { SliderRow, SwitchRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import {
  // 모양
  $toggleDefaultImage,
  $setResizeImage,
  $setResizeVideo,
  $toggleUnvote,
  // 동작
  $toggleBlockMediaNewWindow,
  $toggleIgnoreSpoilerFilter,
  $toggleIgnoreExternalLinkWarning,
  $toggleRateDownGuard,
} from '../slice';

const View = forwardRef((_props, ref) => {
  const {
    // 모양
    hideDefaultImage,
    resizeImage,
    resizeVideo,
    hideUnvote,
    // 동작
    blockMediaNewWindow,
    ignoreSpoilerFilter,
    ignoreExternalLinkWarning,
    ratedownGuard,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">모양 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="대문 이미지 숨김"
            value={hideDefaultImage}
            action={$toggleDefaultImage}
          />
          <SliderRow
            divider
            primary="이미지 크기"
            opacityOnChange={0.6}
            value={resizeImage}
            action={$setResizeImage}
          />
          <SliderRow
            divider
            primary="동영상 크기"
            opacityOnChange={0.6}
            value={resizeVideo}
            action={$setResizeVideo}
          />
          <SwitchRow
            divider
            primary="비추천 버튼 숨김"
            value={hideUnvote}
            action={$toggleUnvote}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">동작 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="이미지, 동영상 새 창 열기 방지"
            secondary="새로고침 후에 적용됩니다."
            value={blockMediaNewWindow}
            action={$toggleBlockMediaNewWindow}
          />
          <SwitchRow
            divider
            primary="스포일러 경고 무시"
            value={ignoreSpoilerFilter}
            action={$toggleIgnoreSpoilerFilter}
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
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
