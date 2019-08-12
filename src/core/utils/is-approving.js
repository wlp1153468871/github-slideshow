import { INSTANCE_STATUS } from '@/core/constants/constants';

const { APPROVING } = INSTANCE_STATUS; // INSTANCE_STATUS

export default function isApproving(status) {
  const APPROVE_STATUS = [
    APPROVING,
  ];
  return APPROVE_STATUS.includes(status);
}
