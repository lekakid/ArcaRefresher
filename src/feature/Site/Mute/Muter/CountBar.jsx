import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Chip,
  DialogContentText,
  Grid2 as Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Cancel, Visibility, VisibilityOff } from '@mui/icons-material';

import { useConfirm } from 'component';

import { $toggleCountBar, $toggleMutedMark } from '../slice';
import Info from '../FeatureInfo';

const TypeString = {
  keyword: '키워드',
  user: '사용자',
  emoticon: '아카콘',
  channel: '채널',
  category: '카테고리',
  deleted: '삭제됨',
  all: '전체',
};

function CountBar({
  renderContainer,
  controlTarget,
  hideMutedToggleBtn,
  count,
  hide,
}) {
  const [showStates, setShowStates] = useState(undefined);
  const hideMutedMark = useSelector(
    (state) => state[Info.id].storage.hideMutedMark,
  );

  const [confirm, ConfirmDialog] = useConfirm();
  const dispatch = useDispatch();

  useEffect(() => {
    setShowStates((prev) =>
      Object.fromEntries(Object.keys(count).map((key) => [key, prev?.[key]])),
    );
  }, [count]);

  const handleHideCount = async () => {
    const result = await confirm({
      title: '뮤트 표시 숨기기',
      content: (
        <DialogContentText>
          상단의 리프레셔 설정 &gt; 뮤트 &gt; 뮤트 카운터 바 숨김에서 다시
          복원할 수 있습니다.
        </DialogContentText>
      ),
    });

    if (result) {
      dispatch($toggleCountBar());
    }
  };

  const handleClick = useCallback(
    (key) => () => {
      const suffix = key === 'all' ? '' : `-${key}`;
      const className = `show-filtered${suffix}`;
      setShowStates((prev) => {
        controlTarget.classList.toggle(className, !prev[key]);
        return {
          ...prev,
          [key]: !prev[key],
        };
      });
    },
    [controlTarget],
  );

  if (count.all === 0 || (hide && count.deleted === 0)) return null;
  if (!showStates) return null;

  return ReactDOM.createPortal(
    <>
      <Grid
        container
        sx={{
          borderBottom: '1px solid var(--color-bd-outer)',
          alignItems: 'center',
        }}
      >
        <Grid
          container
          size={{ xs: 12, sm: 4 }}
          alignItems="center"
          gap={0.5}
          sx={{ paddingLeft: 1 }}
        >
          <Typography variant="subtitle1">뮤트(리프레셔)</Typography>
          <Tooltip title="카운트 바 숨김">
            <IconButton
              size="small"
              sx={{ padding: 0.2 }}
              onClick={handleHideCount}
            >
              <Cancel />
            </IconButton>
          </Tooltip>
          {!hideMutedToggleBtn && (
            <Tooltip title="[뮤트됨] 표시">
              <IconButton
                size="small"
                sx={{ padding: 0.2 }}
                onClick={() => dispatch($toggleMutedMark())}
              >
                {hideMutedMark ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
          )}
        </Grid>
        <Grid
          size={{ xs: 12, sm: 8 }}
          sx={{
            paddingRight: 1,
            textAlign: 'end',
            '& *': {
              marginLeft: 0.5,
            },
          }}
        >
          {Object.entries(count).map(([key, value]) => {
            if (key === 'preview') return null;
            if (hide && key !== 'deleted') return null;
            const suffix = key === 'all' ? '' : `-${key}`;
            const className = `show-filtered${suffix}`;
            return (
              count[key] > 0 && (
                <Chip
                  key={key}
                  variant={showStates[key] ? 'outlined' : 'default'}
                  size="small"
                  className={className}
                  data-key={key}
                  onClick={handleClick(key)}
                  label={`${TypeString[key]} (${value})`}
                />
              )
            );
          })}
        </Grid>
      </Grid>
      <ConfirmDialog />
    </>,
    renderContainer,
  );
}

CountBar.propTypes = {
  renderContainer: PropTypes.object,
  controlTarget: PropTypes.object,
  hideMutedToggleBtn: PropTypes.bool,
  count: PropTypes.object,
  hide: PropTypes.bool,
};

CountBar.defaultProps = {
  hideMutedToggleBtn: false,
  count: {
    keyword: 0,
    user: 0,
    channel: 0,
    category: 0,
    deleted: 0,
    all: 0,
  },
  hide: false,
};

export default CountBar;
