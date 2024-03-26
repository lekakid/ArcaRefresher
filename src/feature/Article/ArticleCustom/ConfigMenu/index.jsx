import { ViewQuilt } from '@mui/icons-material';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  order: -2,
  Icon: ViewQuilt,
  label: Info.name,
  View,
};
