import ArticleIcon from '@mui/icons-material/Article';

import ArticleMenu from './ArticleMenu';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: ArticleIcon,
  label: info.name,
  View: ArticleMenu,
};
