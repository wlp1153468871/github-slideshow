import { isEmpty } from 'lodash';

/**
 * git rev-parse --short HEAD
 * @param {String} commitId commit id
 */
export default function shortCommitFilter(commitId) {
  if (isEmpty(commitId)) return '--';
  return commitId.slice(0, 7);
}
