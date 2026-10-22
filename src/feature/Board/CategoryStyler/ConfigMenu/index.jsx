import ColorizeIcon from '@mui/icons-material/Colorize';

import CategoryStyler from './CategoryStyler';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: ColorizeIcon,
  label: info.name,
  View: CategoryStyler,
};
