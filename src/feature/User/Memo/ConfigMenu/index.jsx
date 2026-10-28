import CommentIcon from '@mui/icons-material/Comment';

import View from './Memo';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: CommentIcon,
  label: info.name,
  View,
};
