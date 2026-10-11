import FolderIcon from '@mui/icons-material/Folder';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: FolderIcon,
  label: Info.name,
  View,
};
