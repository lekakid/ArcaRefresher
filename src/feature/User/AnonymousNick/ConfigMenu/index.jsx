import { PeopleOutline } from '@mui/icons-material';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: PeopleOutline,
  label: Info.name,
  View,
};
