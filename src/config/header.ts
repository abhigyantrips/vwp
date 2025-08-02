export type HeaderConfig = typeof headerConfig;

export const headerConfig = {
  logo: '/logo.png',
  institute: {
    logo: '/institutes/mahe.svg',
    name: 'Manipal Academy of Higher Education',
    url: 'https://manipal.edu',
  },
  url: 'https://nss.manipal.edu',
  navigation: [
    {
      label: 'About Us',
      href: '/about',
    },
    {
      label: 'Our Projects',
      href: '/projects',
    },
    {
      label: 'Get Involved',
      href: '/get-involved',
    },
  ] satisfies {
    label: string;
    links?: {
      label: string;
      href: string;
    }[];
    href?: string;
  }[],
} as const;
