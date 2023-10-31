import { PeopleOutline } from '@material-ui/icons';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.ID,
  group: 'user',
  Icon: PeopleOutline,
  label: Info.name,
  View,
};
