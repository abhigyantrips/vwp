'use client';

import { CircleUserRound, Menu } from 'lucide-react';

import { useEffect, useState } from 'react';

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 flex h-24 w-full items-center justify-between p-2 transition-all duration-300 lg:h-32 lg:p-6 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent text-white [&_button]:text-white [&_img]:brightness-0 [&_img]:invert'
      }`}
    >
      {/* Clickable Logo */}
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
          className={`transition-colors duration-300 ${
            isScrolled ? 'bg-gray-300' : 'bg-white/30'
          }`}
        />
        <Link href={headerConfig.institute.url}>
          <img
            src={headerConfig.institute.logo}
            alt={headerConfig.institute.name}
            className="max-h-32 cursor-pointer object-contain px-4 transition-all duration-300"
          />
        </Link>
      </div>

      {/* Mobile Navigation (Drawer) */}
      <div className="lg:hidden">
        <Drawer direction="right">
          <DrawerTrigger className="mr-2" asChild>
            <Button size="icon" variant={isScrolled ? 'default' : 'ghost'}>
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
                  <Link rel="noopener noreferrer" target="_blank" href="/login">
                    Login
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
          <Button
            key={item.label}
            variant="ghost"
            className={`transition-colors duration-300 ${
              isScrolled
                ? 'text-gray-900 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
            asChild
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
        <Button
          className={`ml-2 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          size="icon"
          variant="secondary"
          asChild
        >
          <Link rel="noopener noreferrer" target="_blank" href="/login">
            <CircleUserRound className="!size-8" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
