import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, MenuItem, Paper, Typography } from '@mui/material';

import { SelectRow, SliderRow, SwitchRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import {
  // 모양
  $toggleLongComment,
  $toggleModifiedIndicator,
  $toggleReverseComment,
  $toggleHideVoiceComment,
  $setResizeEmoticonPalette,
  // 동작
  $toggleFold,
  $toggleWideArea,
  $setAlternativeSubmitKey,
} from '../slice';

function emotLabelFormat(x) {
  return `${x}칸`;
}

const View = forwardRef((_props, ref) => {
  const {
    // 모양
    unfoldLongComment,
    modifiedIndicator,
    reverseComment,
    hideVoiceComment,
    resizeEmoticonPalette,
    // 동작
    foldComment,
    wideClickArea,
    alternativeSubmitKey,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">모양 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="장문 댓글 바로보기"
            secondary="4줄 이상 작성된 댓글을 바로 펼쳐봅니다."
            value={unfoldLongComment}
            action={$toggleLongComment}
          />
          <SwitchRow
            divider
            primary="댓글 *수정됨 표시"
            value={modifiedIndicator}
            action={$toggleModifiedIndicator}
          />
          <SwitchRow
            divider
            primary="댓글 입력창을 가장 위로 올리기"
            value={reverseComment}
            action={$toggleReverseComment}
          />
          <SwitchRow
            divider
            primary="음성 댓글 버튼 숨기기"
            value={hideVoiceComment}
            action={$toggleHideVoiceComment}
          />
          <SliderRow
            primary="이모티콘 선택창 높이"
            sliderProps={{
              min: 2,
              max: 5,
              step: 1,
              marks: true,
              valueLabelFormat: emotLabelFormat,
              valueLabelDisplay: 'auto',
            }}
            value={resizeEmoticonPalette}
            action={$setResizeEmoticonPalette}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">동작 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="댓글 접기"
            secondary="게시물 댓글을 접고 댓글 보기 버튼을 추가합니다."
            value={foldComment}
            action={$toggleFold}
          />
          <SwitchRow
            divider
            primary="넓은 답글 버튼 사용"
            secondary="댓글 어디를 클릭하든 답글창이 열립니다."
            value={wideClickArea}
            action={$toggleWideArea}
          />
          <SelectRow
            primary="댓글 작성키 변경"
            value={alternativeSubmitKey}
            action={$setAlternativeSubmitKey}
          >
            <MenuItem value="">Enter</MenuItem>
            <MenuItem value="ctrlKey">Ctrl+Enter</MenuItem>
            <MenuItem value="shiftKey">Shift+Enter</MenuItem>
          </SelectRow>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
