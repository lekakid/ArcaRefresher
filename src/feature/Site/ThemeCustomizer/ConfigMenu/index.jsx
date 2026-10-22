import BrushIcon from '@mui/icons-material/Brush';

import ThemeCustomizer from './ThemeCustomizer';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: BrushIcon,
  label: info.name,
  View: ThemeCustomizer,
};
