import { CircleUserRound, Menu } from 'lucide-react';

import Link from 'next/link';

import { headerConfig } from '@/config/header';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { Separator } from './ui/separator';

export function Header() {
  return (
    <header className="flex h-24 items-center justify-between p-2 lg:h-32 lg:p-6">
      {/* Clickable Logo */}
      <div className="flex h-full items-center">
        <Link href="/">
          <img
            src={headerConfig.logo}
            alt="Header"
            className="size-28 cursor-pointer object-contain"
          />
        </Link>
        <Separator orientation="vertical" className="bg-gray-300" />
        <Link href={headerConfig.institute.url}>
          <img
            src={headerConfig.institute.logo}
            alt={headerConfig.institute.name}
            className="max-h-32 cursor-pointer object-contain px-4"
          />
        </Link>
      </div>

      {/* Mobile Navigation (Drawer) */}
      <div className="lg:hidden">
        <Drawer direction="right">
          <DrawerTrigger className="mr-2" asChild>
            <Button size="icon">
              <Menu className="!size-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="right-0 left-auto">
            <DrawerHeader className="text-left">
              <DrawerTitle>
                <Link href="/">
                  <img
                    src={headerConfig.logo}
                    alt="Header"
                    className="cursor-pointer"
                  />
                </Link>
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-2 p-4 lowercase">
              {headerConfig.navigation.map((item) => (
                <DrawerClose key={item.label} asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xl font-light"
                    asChild
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                </DrawerClose>
              ))}
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button
                  size="lg"
                  className="w-full text-lg font-light lowercase"
                  asChild
                >
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://momence.com/u/s-reformer-pilates-CLHSGY"
                  >
                    Book Now
                  </Link>
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-1 lg:flex">
        {headerConfig.navigation.map((item) => (
          <Button key={item.label} variant="ghost" asChild>
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
        <Button
          className="ml-2 rounded-full"
          size="icon"
          variant="secondary"
          asChild
        >
          <Link rel="noopener noreferrer" target="_blank" href="/login">
            <CircleUserRound className="!size-8 text-gray-500" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
