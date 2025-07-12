import type { Access } from 'payload';

import { getUserTenantIDs } from '@/utilities/get-user-tenant-ids';
import { isSuperAdmin } from '@/utilities/is-super-admin';

// Only super admins can create pages
export const createAccess: Access = ({ req }) => {
  return isSuperAdmin(req.user);
};

// Anyone with a user can read pages
export const readAccess: Access = ({ req }) => {
  return Boolean(req.user);
};

// Only super admins and tenant admins can update pages
export const updateAccess: Access = ({ req }) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  return {
    id: {
      in: getUserTenantIDs(req.user, 'tenant-admin'),
    },
  };
};

// Only super admins can delete pages
export const deleteAccess: Access = ({ req }) => {
  return isSuperAdmin(req.user);
};
