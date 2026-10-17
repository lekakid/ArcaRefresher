import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

import View from './View';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  key: info.id,
  order: -2,
  Icon: ViewQuiltIcon,
  label: info.name,
  View,
};
