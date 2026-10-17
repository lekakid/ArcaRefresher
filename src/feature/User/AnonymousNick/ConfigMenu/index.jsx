import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

import View from './View';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  key: info.id,
  Icon: PeopleOutlinedIcon,
  label: info.name,
  View,
};
