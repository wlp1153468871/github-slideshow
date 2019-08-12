import { APPROVAL_PROCESS_TYPES } from '@/core/constants/constants';

const {
  APPROVING,
  PROCESS_PENDING,
  PROCESS_ONDOING,
  PROCESS_REJECTED,
} = APPROVAL_PROCESS_TYPES;

export default function isApprove(status) {
  return [
    APPROVING,
    PROCESS_PENDING,
    PROCESS_ONDOING,
    PROCESS_REJECTED,
  ].includes(status);
}
