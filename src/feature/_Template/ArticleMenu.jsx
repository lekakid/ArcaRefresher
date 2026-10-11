import { useCallback } from 'react';
import { Button } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

// import Info from './FeatureInfo';

// 게시물 상단 메뉴
export default function ArticleMenu() {
  const handleToggle = useCallback(() => {
    // 클릭 시 동작 작성
  }, []);

  return (
    <Button
      size="small"
      variant="text"
      startIcon={<PeopleAltOutlinedIcon />}
      onClick={handleToggle}
    >
      버튼
    </Button>
  );
}
