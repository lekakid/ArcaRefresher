import GetAppIcon from '@mui/icons-material/GetApp';

import View from './View';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: GetAppIcon,
  label: info.name,
  View,
};
