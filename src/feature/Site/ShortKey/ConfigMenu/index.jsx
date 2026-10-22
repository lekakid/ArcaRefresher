import GroupIcon from '@mui/icons-material/Group';

import ShortKey from './ShortKey';
import group from '../../group.jsx';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  id: info.id,
  group,
  Icon: GroupIcon,
  label: info.name,
  View: ShortKey,
};
