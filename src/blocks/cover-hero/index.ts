import type { Block } from 'payload';

export const CoverHero: Block = {
  slug: 'cover-hero',
  labels: {
    singular: 'Cover Hero',
    plural: 'Cover Heroes',
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
      required: true,
    },
  ],
};
