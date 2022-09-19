import { useSelector } from 'react-redux';
import Info from './FeatureInfo';

export default function useParser() {
  return useSelector((state) => state[Info.ID]);
}
