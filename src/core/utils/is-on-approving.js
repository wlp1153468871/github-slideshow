import { APPROVAL_PROCESS_TYPES } from '@/core/constants/constants';

const { APPROVING, PROCESS_PENDING, PROCESS_ONDOING } = APPROVAL_PROCESS_TYPES;

export default function isOnApproveing(status) {
  return [APPROVING, PROCESS_PENDING, PROCESS_ONDOING].includes(status);
}
