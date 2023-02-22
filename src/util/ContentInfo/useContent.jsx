import { useSelector } from 'react-redux';
import Info from './FeatureInfo';

/**
 * 게시판 및 게시물 정보를 받아옵니다.
 * @returns {{
 *  channel: {
 *    ID: string,
 *    name: string,
 *    category: [{id, text}]
 *  },
 *  article: {
 *    ID: string,
 *    category: string,
 *    title: string,
 *    author: string,
 *    url: string
 *  }
 * }}
 */
export default function useContent() {
  return useSelector((state) => state[Info.ID]);
}
