import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { buildConfig } from 'payload';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import type { Config } from '@payload-types';

import { getUserTenantIDs } from '@/utilities/get-user-tenant-ids';
import { isSuperAdmin } from '@/utilities/is-super-admin';

import { Media } from '@/collections/media';
import { Tenants } from '@/collections/tenants';
import { Users } from '@/collections/users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  routes: {
    admin: '/portal',
  },
  admin: {
    user: 'users',
    avatar: {
      Component: '/src/admin/components/profile-picture.tsx',
    },
    components: {
      graphics: {
        Icon: '/src/graphics/icon/index.tsx#Icon',
        Logo: '/src/graphics/logo/index.tsx#Logo',
      },
      views: {
        CreateUser: {
          Component: '/src/admin/views/create-user.tsx',
          path: '/create-user',
          exact: true,
          meta: {
            title: 'Create User',
            description: 'Create new volunteer accounts',
          },
        },
      },
    },
  },
  collections: [Media, Tenants, Users],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  editor: lexicalEditor({}),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  secret: process.env.PAYLOAD_SECRET as string,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'types', 'payload.ts'),
  },
  plugins: [
    multiTenantPlugin<Config>({
      collections: {},
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) {
              return true;
            }
            return getUserTenantIDs(req.user).length > 0;
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
});
