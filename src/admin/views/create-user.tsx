'use client';

import { CreateUserForm } from '@/admin/components/create-user-form';

import React from 'react';

import type { AdminViewProps } from 'payload';

import { Gutter } from '@payloadcms/ui';

import { Tenant } from '@payload-types';

const CreateUserView: React.FC<AdminViewProps> = ({ initPageResult }) => {
  const {
    req: { payload },
  } = initPageResult;

  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTenants = async () => {
      try {
        const result = await payload.find({
          collection: 'tenants',
          limit: 1000,
          sort: 'name',
        });
        setTenants(result.docs);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [payload]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Gutter>
        <div className="py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New User
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Invite a new volunteer to join the NSS portal. They will receive
              an email with instructions to complete their profile.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow">
              <CreateUserForm tenants={tenants} />
            </div>
          )}
        </div>
      </Gutter>
    </div>
  );
};

export default CreateUserView;
