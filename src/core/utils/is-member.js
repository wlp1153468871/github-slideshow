/**
 * check the user is member
 */
import { PLATFORM_ROLE } from '@/core/constants/role';
import { get as getValue } from 'lodash';
import StorageCache from '@/core/services/storage.cache';

function isMember() {
  return (
    getValue(StorageCache.getUser(), 'platform_role') ===
    PLATFORM_ROLE.MEMBER
  );
}

export default isMember;
