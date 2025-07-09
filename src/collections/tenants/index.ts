import type { CollectionConfig } from 'payload';

import {
  createAccess,
  deleteAccess,
  readAccess,
  updateAccess,
} from '@/collections/tenants/access';

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: {
    singular: 'Tenant',
    plural: 'Tenants',
  },
  access: {
    create: createAccess,
    delete: deleteAccess,
    read: readAccess,
    update: updateAccess,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Administration',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Used for domain-based tenant handling',
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      required: true,
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation === 'create') {
          req.payload.logger.info(
            `New tenant created: ${doc.name}. Seeding default configs...`
          );

          const tenantId = doc.id;

          try {
            await req.payload.create({
              collection: 'site-configs',
              data: {
                tenant: tenantId,
                siteTitle: `${doc.name} Website`,
              },
              req: req,
            });
            req.payload.logger.info(
              `Created default SiteConfig for tenant ${doc.name}`
            );

            await req.payload.create({
              collection: 'headers',
              data: {
                tenant: tenantId,
                logo: null,
                mainNav: [],
              },
              req: req,
            });
            req.payload.logger.info(
              `Created default Header for tenant ${doc.name}`
            );

            await req.payload.create({
              collection: 'footers',
              data: {
                tenant: tenantId,
                copyrightText: {
                  root: {
                    children: [
                      {
                        children: [
                          {
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: `© ${new Date().getFullYear()} ${doc.name}. All rights reserved.`,
                            type: 'text',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        type: 'paragraph',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1,
                  },
                },
                footerNavColumns: [],
                socialLinks: [],
              },
              req: req,
            });
            req.payload.logger.info(
              `Created default Footer for tenant ${doc.name}`
            );
          } catch (error) {
            req.payload.logger.error({
              message: `Error seeding default configs for tenant ${doc.name}: ${error}`,
              error: error,
            });
          }
        }
      },
    ],
  },
};
