import { CoverHero } from '@/blocks/cover-hero';
import { GalleryCarousel } from '@/blocks/gallery-carousel';
import { OfficeBearers } from '@/blocks/office-bearers';
import { PartnershipsCarousel } from '@/blocks/partnerships-carousel';
import { RecentWork } from '@/blocks/recent-work';
import { Section } from '@/blocks/section';

import type { CollectionConfig } from 'payload';

import {
  createAccess,
  deleteAccess,
  readAccess,
  updateAccess,
} from '@/collections/pages/access';
import { ensureUniqueSlug } from '@/collections/pages/hooks';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  access: {
    create: createAccess,
    delete: deleteAccess,
    read: readAccess,
    update: updateAccess,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'content',
              type: 'blocks',
              blocks: [
                CoverHero,
                GalleryCarousel,
                OfficeBearers,
                PartnershipsCarousel,
                RecentWork,
                Section,
              ],
            },
          ],
        },
        {
          label: 'SEO & Settings',
          fields: [
            {
              name: 'slug',
              type: 'text',
              defaultValue: 'home',
              required: true,
              admin: {
                description: 'The URL-friendly page name (e.g., "about-us")',
              },
              hooks: {
                beforeValidate: [ensureUniqueSlug],
              },
              index: true,
            },
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
              defaultValue: 'draft',
              admin: {
                position: 'sidebar',
                description: 'Only published pages are visible to the public',
              },
            },
            {
              name: 'seo',
              label: 'SEO',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description:
                      'Custom page title for search engines. Defaults to page title if empty.',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  admin: {
                    description:
                      'Brief description for search results and social sharing (recommended: 50-160 characters).',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Image shown when sharing on social media (recommended: 1200×630 pixels).',
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description:
                      'Prevent search engines from indexing this page',
                  },
                },
              ],
              admin: {
                description: 'Search engine optimization settings',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // If no custom meta title is set, use the page title
        if (data.seo && !data.seo.metaTitle && data.title) {
          data.seo.metaTitle = data.title;
        }

        return data;
      },
    ],
  },
};
