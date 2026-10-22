import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import UserProfile from './UserProfile';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  order: -1,
  Icon: AssignmentIndIcon,
  label: info.name,
  View: UserProfile,
};
