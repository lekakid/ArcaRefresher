import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  order: -1,
  Icon: ViewQuiltIcon,
  label: Info.name,
  View,
};
