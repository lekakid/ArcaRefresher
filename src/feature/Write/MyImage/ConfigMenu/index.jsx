import ImageIcon from '@mui/icons-material/Image';

import View from './MyImage';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: ImageIcon,
  label: info.name,
  View,
};
