import { useSelector } from 'react-redux';
import Info from './FeatureInfo';

export default function useContent() {
  return useSelector((state) => state[Info.ID]);
}
