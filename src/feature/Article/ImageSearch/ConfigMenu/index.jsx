import SearchIcon from '@mui/icons-material/Search';

import View from './View';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: SearchIcon,
  label: info.name,
  View,
};
