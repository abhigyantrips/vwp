// src/collections/users/endpoints.ts
import crypto from 'crypto';

import type { Endpoint } from 'payload';
import { APIError, headersWithCors } from 'payload';

import { getUserTenantIDs } from '@/utilities/get-user-tenant-ids';
import { isSuperAdmin } from '@/utilities/is-super-admin';
import { generateOnboardingEmail, sendEmail } from '@/utilities/send-email';

// Create a pending user and send onboarding email
export const createPendingUser: Endpoint = {
  handler: async (req) => {
    const { user } = req;

    if (!user) {
      throw new APIError('Unauthorized', 401, null, true);
    }

    let data: { [key: string]: any } = {};

    try {
      if (typeof req.json === 'function') {
        data = await req.json();
      }
    } catch (error) {
      throw new APIError('Invalid JSON data', 400, null, true);
    }

    const { email, name, manipalLearnerId, tenantId } = data;

    // Validate required fields
    if (!email || !name || !manipalLearnerId || !tenantId) {
      throw new APIError(
        'Missing required fields: email, name, manipalLearnerId, tenantId',
        400,
        null,
        true
      );
    }

    // Check if user has permission to create users for this tenant
    const userTenantIds = getUserTenantIDs(user, 'programme-officer');
    const unitHeadTenantIds = getUserTenantIDs(user, 'unit-head');
    const isUserSuperAdmin = isSuperAdmin(user);

    const hasPermission =
      isUserSuperAdmin ||
      userTenantIds.includes(tenantId) ||
      unitHeadTenantIds.includes(tenantId);

    if (!hasPermission) {
      throw new APIError(
        'Insufficient permissions to create users for this unit',
        403,
        null,
        true
      );
    }

    // Get tenant information
    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: tenantId,
    });

    if (!tenant) {
      throw new APIError('Tenant not found', 404, null, true);
    }

    // Check if user with this email already exists
    const existingUser = await req.payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingUser.docs.length > 0) {
      throw new APIError(
        'User with this email already exists',
        409,
        null,
        true
      );
    }

    // Create the pending user
    const newUser = await req.payload.create({
      collection: 'users',
      data: {
        email,
        Name: name,
        manipalLearnerId,
        status: 'pending_setup',
        tenants: [
          {
            tenant: tenantId,
            roles: 'unit-volunteer',
          },
        ],
      },
    });

    // Send onboarding email
    const emailContent = generateOnboardingEmail(
      name,
      newUser.onboardingToken!,
      tenant.name
    );

    const emailResult = await sendEmail({
      to: manipalLearnerId,
      ...emailContent,
    });

    if (!emailResult.success) {
      // Delete the created user if email fails
      await req.payload.delete({
        collection: 'users',
        id: newUser.id,
      });

      throw new APIError('Failed to send onboarding email', 500, null, true);
    }

    return Response.json(
      {
        success: true,
        message: 'User created and onboarding email sent',
        userId: newUser.id,
      },
      {
        headers: headersWithCors({ headers: req.headers, req }),
        status: 200,
      }
    );
  },
  method: 'post',
  path: '/create-pending',
};

// Validate onboarding token
export const validateOnboardingToken: Endpoint = {
  handler: async (req) => {
    if (!req.url) {
      throw new APIError('Invalid request URL', 400, null, true);
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const token = pathSegments[pathSegments.length - 1];

    if (!token) {
      throw new APIError('Token is required', 400, null, true);
    }

    // Find user with this token
    const user = await req.payload.find({
      collection: 'users',
      where: {
        and: [
          {
            onboardingToken: {
              equals: token,
            },
          },
          {
            onboardingTokenExpiry: {
              greater_than: new Date(),
            },
          },
          {
            status: {
              equals: 'pending_setup',
            },
          },
        ],
      },
    });

    if (user.docs.length === 0) {
      throw new APIError('Invalid or expired token', 400, null, true);
    }

    const userData = user.docs[0];

    return Response.json(
      {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          Name: userData.Name,
          manipalLearnerId: userData.manipalLearnerId,
          tenants: userData.tenants,
        },
      },
      {
        headers: headersWithCors({ headers: req.headers, req }),
        status: 200,
      }
    );
  },
  method: 'get',
  path: '/validate-token/[token]',
};

// Complete onboarding
export const completeOnboarding: Endpoint = {
  handler: async (req) => {
    let data: { [key: string]: any } = {};

    try {
      if (typeof req.json === 'function') {
        data = await req.json();
      }
    } catch (error) {
      throw new APIError('Invalid JSON data', 400, null, true);
    }

    const { token, about, bloodGroup, profilePicture, password } = data;

    if (!token || !password) {
      throw new APIError('Token and password are required', 400, null, true);
    }

    // Find user with this token
    const userResult = await req.payload.find({
      collection: 'users',
      where: {
        and: [
          {
            onboardingToken: {
              equals: token,
            },
          },
          {
            onboardingTokenExpiry: {
              greater_than: new Date(),
            },
          },
          {
            status: {
              equals: 'pending_setup',
            },
          },
        ],
      },
    });

    if (userResult.docs.length === 0) {
      throw new APIError('Invalid or expired token', 400, null, true);
    }

    const user = userResult.docs[0];

    // Update user with onboarding data
    const updatedUser = await req.payload.update({
      collection: 'users',
      id: user.id,
      data: {
        about,
        bloodGroup,
        profilePicture,
        password,
        status: 'pending_approval',
        onboardingToken: null, // Clear the token
        onboardingTokenExpiry: null,
      },
    });

    return Response.json(
      {
        success: true,
        message: 'Profile completed successfully. Awaiting approval.',
        userId: updatedUser.id,
      },
      {
        headers: headersWithCors({ headers: req.headers, req }),
        status: 200,
      }
    );
  },
  method: 'post',
  path: '/complete-onboarding',
};

// Approve user
export const approveUser: Endpoint = {
  handler: async (req) => {
    const { user } = req;

    if (!user) {
      throw new APIError('Unauthorized', 401, null, true);
    }

    if (!req.url) {
      throw new APIError('Invalid request URL', 400, null, true);
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const userIdStr = pathSegments[pathSegments.length - 1];

    if (!userIdStr) {
      throw new APIError('User ID is required', 400, null, true);
    }

    const userId = parseInt(userIdStr);
    if (isNaN(userId)) {
      throw new APIError('Invalid user ID', 400, null, true);
    }

    // Get the user to approve
    const userToApprove = await req.payload.findByID({
      collection: 'users',
      id: userId,
    });

    if (!userToApprove) {
      throw new APIError('User not found', 404, null, true);
    }

    if (userToApprove.status !== 'pending_approval') {
      throw new APIError('User is not pending approval', 400, null, true);
    }

    // Check if current user has permission to approve this user
    const userTenantIds = getUserTenantIDs(user, 'programme-officer');
    const unitHeadTenantIds = getUserTenantIDs(user, 'unit-head');
    const isUserSuperAdmin = isSuperAdmin(user);

    const userToApproveTenantIds = getUserTenantIDs(userToApprove);

    const hasPermission =
      isUserSuperAdmin ||
      userTenantIds.some((id) => userToApproveTenantIds.includes(id)) ||
      unitHeadTenantIds.some((id) => userToApproveTenantIds.includes(id));

    if (!hasPermission) {
      throw new APIError(
        'Insufficient permissions to approve this user',
        403,
        null,
        true
      );
    }

    // Approve the user
    await req.payload.update({
      collection: 'users',
      id: userToApprove.id,
      data: {
        status: 'active',
      },
    });

    return Response.json(
      {
        success: true,
        message: 'User approved successfully',
      },
      {
        headers: headersWithCors({ headers: req.headers, req }),
        status: 200,
      }
    );
  },
  method: 'post',
  path: '/approve/[userId]',
};

// Reject user
export const rejectUser: Endpoint = {
  handler: async (req) => {
    const { user } = req;

    if (!user) {
      throw new APIError('Unauthorized', 401, null, true);
    }

    if (!req.url) {
      throw new APIError('Invalid request URL', 400, null, true);
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const userIdStr = pathSegments[pathSegments.length - 1];

    if (!userIdStr) {
      throw new APIError('User ID is required', 400, null, true);
    }

    const userId = parseInt(userIdStr);
    if (isNaN(userId)) {
      throw new APIError('Invalid user ID', 400, null, true);
    }

    let data: { [key: string]: any } = {};

    try {
      if (typeof req.json === 'function') {
        data = await req.json();
      }
    } catch (error) {
      // Rejection reason is optional
    }

    const { reason } = data;

    // Get the user to reject
    const userToReject = await req.payload.findByID({
      collection: 'users',
      id: userId,
    });

    if (!userToReject) {
      throw new APIError('User not found', 404, null, true);
    }

    if (userToReject.status !== 'pending_approval') {
      throw new APIError('User is not pending approval', 400, null, true);
    }

    // Check if current user has permission to reject this user
    const userTenantIds = getUserTenantIDs(user, 'programme-officer');
    const unitHeadTenantIds = getUserTenantIDs(user, 'unit-head');
    const isUserSuperAdmin = isSuperAdmin(user);

    const userToRejectTenantIds = getUserTenantIDs(userToReject);

    const hasPermission =
      isUserSuperAdmin ||
      userTenantIds.some((id) => userToRejectTenantIds.includes(id)) ||
      unitHeadTenantIds.some((id) => userToRejectTenantIds.includes(id));

    if (!hasPermission) {
      throw new APIError(
        'Insufficient permissions to reject this user',
        403,
        null,
        true
      );
    }

    // Reject the user
    await req.payload.update({
      collection: 'users',
      id: userToReject.id,
      data: {
        status: 'rejected',
        // You could add a rejection reason field if needed
      },
    });

    // Optional: Send rejection email
    if (userToReject.manipalLearnerId) {
      const emailContent = {
        subject: 'NSS MAHE - Profile Update Required',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Profile Needs Update</h2>

            <p>Hello ${userToReject.Name},</p>

            <p>Your profile submission requires some updates before approval.</p>

            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}

            <p>Please contact your unit administrator for more details.</p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              National Service Scheme<br>
              Manipal Academy of Higher Education
            </p>
          </div>
        `,
      };

      await sendEmail({
        to: userToReject.manipalLearnerId,
        ...emailContent,
      });
    }

    return Response.json(
      {
        success: true,
        message: 'User rejected successfully',
      },
      {
        headers: headersWithCors({ headers: req.headers, req }),
        status: 200,
      }
    );
  },
  method: 'post',
  path: '/reject/[userId]',
};

// Get pending users for approval
export const getPendingUsers: Endpoint = {
  handler: async (req) => {
    const { user } = req;

    if (!user) {
      throw new APIError('Unauthorized', 401, null, true);
    }

    // Check if user has permission to view pending users
    const userTenantIds = getUserTenantIDs(user, 'programme-officer');
    const unitHeadTenantIds = getUserTenantIDs(user, 'unit-head');
    const isUserSuperAdmin = isSuperAdmin(user);

    let whereClause: any = {
      status: {
        equals: 'pending_approval',
      },
    };

    // If not super admin, filter by tenant access
    if (!isUserSuperAdmin) {
      const accessibleTenantIds = [...userTenantIds, ...unitHeadTenantIds];

      if (accessibleTenantIds.length === 0) {
        throw new APIError(
          'No permission to view pending users',
          403,
          null,
          true
        );
      }

      whereClause = {
        and: [
          whereClause,
          {
            'tenants.tenant': {
              in: accessibleTenantIds,
            },
          },
        ],
      };
    }

    const pendingUsers = await req.payload.find({
      collection: 'users',
      where: whereClause,
      depth: 2, // This populates relationships
    });

    return Response.json(
      {
        success: true,
        users: pendingUsers.docs,
        totalDocs: pendingUsers.totalDocs,
      },
      {
        headers: headersWithCors({ headers: req.headers, req }),
        status: 200,
      }
    );
  },
  method: 'get',
  path: '/pending-users',
};
