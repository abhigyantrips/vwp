import type { Block } from 'payload';

export const Section: Block = {
  slug: 'section',
  labels: {
    singular: 'Section',
    plural: 'Sections',
  },
  fields: [
    {
      name: 'position',
      type: 'select',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      required: true,
    },
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imagePosition',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'left',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};
