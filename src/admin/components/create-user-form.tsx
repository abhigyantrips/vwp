'use client';

import React, { useState } from 'react';
import { toast } from '@payloadcms/ui';
import { useAuth } from '@payloadcms/ui';

import type { Tenant, User } from '@payload-types';

import { getUserTenantIDs } from '@/utilities/get-user-tenant-ids';
import { isSuperAdmin } from '@/utilities/is-super-admin';

type CreateUserFormProps = {
  tenants: Tenant[];
};

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ tenants }) => {
  const { user } = useAuth<User>();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    manipalLearnerId: '',
    tenantId: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter tenants based on user permissions
  const availableTenants = React.useMemo(() => {
    if (!user) return [];

    if (isSuperAdmin(user)) {
      return tenants;
    }

    const userTenantIds = [
      ...getUserTenantIDs(user, 'programme-officer'),
      ...getUserTenantIDs(user, 'unit-head'),
    ];

    return tenants.filter(tenant => userTenantIds.includes(tenant.id));
  }, [user, tenants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/users/create-pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('User created successfully! Onboarding email sent.');
        setFormData({
          email: '',
          name: '',
          manipalLearnerId: '',
          tenantId: '',
        });
      } else {
        toast.error(result.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (availableTenants.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-yellow-800 font-medium">No Units Available</h3>
        <p className="text-yellow-700 text-sm mt-1">
          You don't have permission to create users for any units.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Login Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="username@domain.com"
          />
          <p className="mt-1 text-xs text-gray-500">
            This will be used for portal login
          </p>
        </div>

        <div>
          <label htmlFor="manipalLearnerId" className="block text-sm font-medium text-gray-700">
            Manipal Email ID *
          </label>
          <input
            type="email"
            id="manipalLearnerId"
            name="manipalLearnerId"
            required
            value={formData.manipalLearnerId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="name@learner.manipal.edu or name@manipal.edu"
          />
          <p className="mt-1 text-xs text-gray-500">
            Must end with @learner.manipal.edu or @manipal.edu. Onboarding instructions will be sent here.
          </p>
        </div>

        <div>
          <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">
            Unit/Campus *
          </label>
          <select
            id="tenantId"
            name="tenantId"
            required
            value={formData.tenantId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a unit</option>
            {availableTenants.map(tenant => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create User & Send Invitation'}
          </button>
        </div>
      </form>
    </div>
  );
};
