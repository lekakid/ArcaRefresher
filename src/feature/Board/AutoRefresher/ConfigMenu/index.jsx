import RefreshIcon from '@mui/icons-material/Refresh';

import View from './AutoRefresher';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: RefreshIcon,
  label: info.name,
  View,
};
