import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

import CommentCustom from './CommentCustom';
import group from '../../group.jsx';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  id: info.id,
  group,
  order: -1,
  Icon: ViewQuiltIcon,
  label: info.name,
  View: CommentCustom,
};
