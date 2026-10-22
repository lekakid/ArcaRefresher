import CommentIcon from '@mui/icons-material/Comment';

import Memo from './Memo';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: CommentIcon,
  label: info.name,
  View: Memo,
};
