import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

import { setOpen } from './slice';
import info from './info';

export default function ArticleMenu() {
  const dispatch = useDispatch();
  const { open } = useSelector((state) => state[info.id]);
  const { enabled } = useSelector((state) => state[info.id].storage);

  const handleOpen = useCallback(() => {
    dispatch(setOpen(true));
  }, [dispatch]);

  if (!enabled) return null;
  return (
    <Button
      size="small"
      variant="text"
      startIcon={<GetAppIcon />}
      onClick={handleOpen}
      disabled={open}
    >
      이미지 다운로더
    </Button>
  );
}
