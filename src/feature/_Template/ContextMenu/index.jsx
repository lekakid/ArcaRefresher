import 'core/types';
import Template from './Template';
import info from '../info';

/** @type {ContextMenuInfo} */
export default {
  key: info.id,
  View: Template,
  order: 900,
};
