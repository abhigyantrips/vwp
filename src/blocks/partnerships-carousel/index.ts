import type { Block } from 'payload';

export const PartnershipsCarousel: Block = {
  slug: 'partnerships-carousel',
  labels: {
    singular: 'Partnerships Carousel',
    plural: 'Partnerships Carousels',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'partners',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
