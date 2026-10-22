import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import Base64 from './Base64';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: DoubleArrowIcon,
  label: info.name,
  View: Base64,
};
