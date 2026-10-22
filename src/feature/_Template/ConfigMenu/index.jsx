import GroupIcon from '@mui/icons-material/Group';

import Template from './Template';
import group from '../../group.jsx';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  id: info.id,
  group,
  Icon: GroupIcon,
  label: info.name,
  View: Template,
};
