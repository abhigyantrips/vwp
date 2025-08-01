import crypto from 'crypto';

import type { CollectionConfig } from 'payload';

import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';

import { isSuperAdmin } from '@/utilities/is-super-admin';

import {
  createAccess,
  deleteAccess,
  readAccess,
  updateAccess,
} from '@/collections/users/access';
import {
  approveUser,
  completeOnboarding,
  createPendingUser,
  getPendingUsers,
  rejectUser,
  validateOnboardingToken,
} from '@/collections/users/endpoints';

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
  endpoints: [
    createPendingUser,
    validateOnboardingToken,
    completeOnboarding,
    approveUser,
    rejectUser,
    getPendingUsers,
  ],
  fields: [
    {
      name: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'about',
      type: 'textarea',
      admin: {
        description: 'Brief description about yourself',
      },
    },
    {
      name: 'position',
      type: 'text',
    },
    {
      name: 'bloodGroup',
      type: 'select',
      options: [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
      ],
      admin: {
        description: 'Your blood group',
      },
    },
    {
      name: 'manipalLearnerId',
      type: 'text',
      admin: {
        description:
          'Your Manipal email ID (@learner.manipal.edu or @manipal.edu)',
      },
      validate: (value: any) => {
        if (!value) return true; // Allow empty for pending users

        const validDomains = ['@learner.manipal.edu', '@manipal.edu'];
        const hasValidDomain = validDomains.some((domain) =>
          value.toLowerCase().endsWith(domain)
        );

        if (!hasValidDomain) {
          return 'Please enter a valid Manipal email ID';
        }

        return true;
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending Setup', value: 'pending_setup' },
        { label: 'Pending Approval', value: 'pending_approval' },
        { label: 'Active', value: 'active' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending_setup',
      admin: {
        position: 'sidebar',
        description: 'Current user status in the onboarding process',
      },
      access: {
        update: ({ req }) => {
          return isSuperAdmin(req.user);
        },
      },
    },
    {
      name: 'onboardingToken',
      type: 'text',
      admin: {
        hidden: true,
      },
      access: {
        read: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: 'onboardingTokenExpiry',
      type: 'date',
      admin: {
        hidden: true,
      },
      access: {
        read: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
      },
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
  hooks: {
    beforeChange: [
      async ({ operation, data, req }) => {
        // Generate onboarding token for new users
        if (operation === 'create' && !data.onboardingToken) {
          data.onboardingToken = crypto.randomBytes(32).toString('hex');
          data.onboardingTokenExpiry = new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ); // 5 days
        }

        return data;
      },
    ],
  },
};
