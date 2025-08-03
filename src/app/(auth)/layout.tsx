import Image from 'next/image';
import Link from 'next/link';

import { headerConfig } from '@/config/header';

import { Separator } from '@/components/ui/separator';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background relative container flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-9 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero-bg.jpg"
            alt="Institute Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60" />
        </div>
        <div className="relative z-20 flex items-center text-xl font-semibold tracking-tight">
          <div className="flex h-full items-center">
            <Link href="/">
              <img
                src={headerConfig.logo}
                alt="Header"
                className="m-4 size-18 cursor-pointer object-contain !brightness-100 !invert-0 transition-all duration-300"
              />
            </Link>
            <Separator
              orientation="vertical"
              className={`bg-white/30 transition-colors duration-300`}
            />
            <Link href={headerConfig.institute.url}>
              <img
                src={headerConfig.institute.logo}
                alt={headerConfig.institute.name}
                className="max-h-32 cursor-pointer object-contain px-4 brightness-0 invert transition-all duration-300"
              />
            </Link>
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <p className="text-lg font-semibold tracking-tight">
            Manipal Academy of Higher Education
          </p>
        </div>
      </div>
      <div className="flex justify-center p-2 lg:p-8">{children}</div>
    </div>
  );
}
