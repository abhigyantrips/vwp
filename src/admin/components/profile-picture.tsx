'use client';

import Image from 'next/image';

import { useAuth } from '@payloadcms/ui';

import type { Media, User } from '@payload-types';

export default function ProfilePicture() {
  const { user } = useAuth<User>();

  return (
    <Image
      className="h-8 w-8 rounded-full object-cover"
      src={(user?.profilePicture as Media)?.url || '/fallbacks/avatar.png'}
      alt="yas"
      width={32}
      height={32}
    />
  );
}
