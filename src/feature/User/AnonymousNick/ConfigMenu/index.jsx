import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

import AnonymousNick from './AnonymousNick';
import group from '../../group.jsx';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  id: info.id,
  group,
  Icon: PeopleOutlinedIcon,
  label: info.name,
  View: AnonymousNick,
};
