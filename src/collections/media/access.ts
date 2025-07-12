import type { Access } from 'payload';

import { getUserTenantIDs } from '@/utilities/get-user-tenant-ids';
import { isSuperAdmin } from '@/utilities/is-super-admin';

// Only super admins and tenant users can create media
export const createAccess: Access = ({ req }) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  return {
    tenant: {
      in: getUserTenantIDs(req.user),
    },
  };
};

// Only super admins and tenant users can read media
export const readAccess: Access = ({ req }) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  return {
    tenant: {
      in: getUserTenantIDs(req.user),
    },
  };
};

// Only super admins and tenant users can update media
export const updateAccess: Access = ({ req }) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  return {
    tenant: {
      in: getUserTenantIDs(req.user),
    },
  };
};

// Only super admins and tenant admins can delete media
export const deleteAccess: Access = ({ req }) => {
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
