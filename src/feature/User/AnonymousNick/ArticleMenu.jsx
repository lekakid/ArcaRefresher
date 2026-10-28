import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import info from './info';
import { toggleShow } from './slice';

export default function ArticleMenu() {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state[info.id]);

  const handleToggle = useCallback(() => {
    dispatch(toggleShow());
  }, [dispatch]);

  return (
    <Button
      size="small"
      variant="text"
      startIcon={<PeopleAltOutlinedIcon />}
      onClick={handleToggle}
    >
      {show ? '익명화 해제' : '익명화'}
    </Button>
  );
}
