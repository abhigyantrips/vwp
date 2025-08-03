'use client';

import { toast } from 'sonner';

import { Suspense, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { UserAuthForm } from '@/components/auth-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function SearchParamsHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('session_expired');
    if (error === 'true') {
      toast.error('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  return null;
}

export default function LoginPage() {
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  useEffect(() => {
    const cookieEnabled = navigator.cookieEnabled;
    setCookiesEnabled(cookieEnabled);

    if (!cookieEnabled) {
      toast.error(
        'Cookies are disabled. Please enable cookies to use this site.'
      );
    }
  }, []);

  return (
    <div className="bg-background relative flex h-full items-center justify-center">
      <Card className="w-full max-w-[600px] min-w-[400px]">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>
            Sign in to access your NSS MAHE account and dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>

        {!cookiesEnabled && (
          <CardFooter>
            <p className="text-destructive text-sm">
              Cookies are disabled. Please enable cookies to use this site.
            </p>
          </CardFooter>
        )}
      </Card>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
    </div>
  );
}
