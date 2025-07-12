import type { CollectionConfig } from 'payload';

import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';

import { isSuperAdmin } from '@/utilities/is-super-admin';

import {
  createAccess,
  deleteAccess,
  readAccess,
  updateAccess,
} from '@/collections/users/access';
import { externalUsersLogin } from '@/collections/users/endpoints';

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: 'unit-volunteer',
      hasMany: false,
      options: [
        {
          label: 'Programme Officer',
          value: 'programme-officer',
        },
        {
          label: 'Unit Head',
          value: 'unit-head',
        },
        {
          label: 'Unit Secretary',
          value: 'unit-secretary',
        },
        {
          label: 'Unit Volunteer',
          value: 'unit-volunteer',
        },
      ],
      required: true,
    },
  ],
});

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: createAccess,
    delete: deleteAccess,
    read: readAccess,
    update: updateAccess,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  auth: true,
  endpoints: [externalUsersLogin],
  fields: [
    {
      name: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
    },
    {
      displayPreview: true,
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: [
        {
          label: 'MAHE Coordinator',
          value: 'super-admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      access: {
        update: ({ req }) => {
          return isSuperAdmin(req.user);
        },
      },
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
};
