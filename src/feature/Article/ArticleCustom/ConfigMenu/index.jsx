import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

import View from './View';
import group from '../../group.jsx';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  id: info.id,
  group,
  order: -2,
  Icon: ViewQuiltIcon,
  label: info.name,
  View,
};
