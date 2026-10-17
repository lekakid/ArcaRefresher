import 'core/types';
import GroupIcon from '@mui/icons-material/Group';

import View from './View';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  key: info.id,
  Icon: GroupIcon,
  label: info.name,
  View,
};
