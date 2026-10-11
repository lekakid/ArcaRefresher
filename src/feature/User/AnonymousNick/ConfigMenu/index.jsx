import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: PeopleOutlineIcon,
  label: Info.name,
  View,
};
