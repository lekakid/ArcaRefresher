import { useSelector } from 'react-redux';
import { MODULE_ID } from './ModuleInfo';

export default function useContextMenuData(dataKey) {
  const { data } = useSelector((state) => state[MODULE_ID]);
  return data[dataKey] || {};
}
