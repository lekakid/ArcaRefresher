import { useEffect, useState } from 'react';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { $setIgnoreVersionTarget, SLICE_ID } from './slice';

function ErrorDialog({ moduleId, text, error }) {
  const dispatch = useDispatch();
  const { resetBoundary } = useErrorBoundary();

  const lastCheckVersion = useSelector(
    (state) => state[SLICE_ID].storage.lastCheckVersion,
  );
  const [ignore, setIgnore] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!error) return;
    if (lastCheckVersion[moduleId] === GM_info.script.version) return;

    setOpen(true);
  }, [moduleId, error, lastCheckVersion]);

  const onClose = () => {
    if (ignore) {
      dispatch(
        $setIgnoreVersionTarget({
          moduleId,
          version: GM_info.script.version,
        }),
      );
    }
    setOpen(false);
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open}>
      <DialogTitle>오류</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`${text} 모듈을 불러오는 중 처리하지 못하는 문제가 발생했습니다.`}
        </DialogContentText>
        <TextField
          sx={{ my: 2 }}
          fullWidth
          multiline
          minRows={10}
          maxRows={30}
          value={error?.stack}
        />
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          label="다음 업데이트까지 이 기능의 오류 무시"
          control={
            <Checkbox
              checked={ignore}
              onChange={(e) => setIgnore(e.target.checked)}
            />
          }
        />
        <Button
          variant="outlined"
          onClick={() => GM_openInTab('https://arca.live/b/namurefresher')}
        >
          문의
        </Button>
        <Button variant="outlined" onClick={resetBoundary}>
          재시도
        </Button>
        <Button variant="contained" onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ErrorDialog.propTypes = {
  moduleId: PropTypes.string,
  text: PropTypes.string,
  error: PropTypes.object,
};

export function ModuleLoadBoundary({ moduleId, text, children }) {
  const [error, setError] = useState(undefined);

  return (
    <ErrorBoundary
      fallback={<ErrorDialog moduleId={moduleId} text={text} error={error} />}
      onError={(e) => setError(e)}
    >
      {children}
    </ErrorBoundary>
  );
}

ModuleLoadBoundary.propTypes = {
  moduleId: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.element,
};
