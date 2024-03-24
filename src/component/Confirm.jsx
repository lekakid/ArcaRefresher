import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const defaultButtonList = [
  { label: '예', value: true, key: 'Enter' },
  { label: '아니오', value: false, key: 'Escape', variant: 'contained' },
];

function ConfirmDialogRenderer({
  open,
  confirmRef,
  title,
  content,
  buttonList = defaultButtonList,
}) {
  const handleBtnDown = useCallback(
    (value) => {
      confirmRef.current(typeof value === 'function' ? value() : value);
    },
    [confirmRef],
  );

  useEffect(() => {
    if (!open) return undefined;

    const keyUpEvent = (e) => {
      const value = buttonList.find((btn) => btn.key === e.key)?.value;
      if (value === undefined) return;

      handleBtnDown(value);
    };

    document.addEventListener('keyup', keyUpEvent);
    return () => document.removeEventListener('keyup', keyUpEvent);
  }, [open, buttonList, handleBtnDown]);

  const dialogContent =
    typeof content === 'string' ? (
      <DialogContentText>{content}</DialogContentText>
    ) : (
      content
    );

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions>
        {buttonList.map(({ variant, label, value }) => (
          <Button
            key={label}
            variant={variant}
            onClick={() => handleBtnDown(value)}
          >
            {label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialogRenderer.propTypes = {
  open: PropTypes.bool.isRequired,
  confirmRef: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  buttonList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      variant: PropTypes.string,
    }),
  ),
};

function useConfirm() {
  const confirmRef = useRef();
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState(undefined);

  const confirm = useCallback(
    (p) =>
      new Promise((resolve) => {
        setProps(p);
        confirmRef.current = (value) => {
          resolve(value);
          setOpen(false);
        };
        setOpen(true);
      }),
    [],
  );
  const ConfirmDialog = () =>
    ConfirmDialogRenderer({ ...props, open, confirmRef });

  return [confirm, ConfirmDialog];
}

export { useConfirm };
