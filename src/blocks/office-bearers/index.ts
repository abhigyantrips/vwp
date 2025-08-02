import type { Block } from 'payload';

export const OfficeBearers: Block = {
  slug: 'office-bearers',
  labels: {
    singular: 'Office Bearer',
    plural: 'Office Bearers',
  },
  fields: [
    {
      name: 'officials',
      type: 'array',
      labels: {
        singular: 'Official',
        plural: 'Officials',
      },
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'buttons',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
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
    },
  ],
};
