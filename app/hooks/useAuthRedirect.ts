"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAuthRedirect() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-session`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) throw new Error('Auth check failed');
        
        const data = await response.json();
        
        if (data.authenticated && pathname === '/sign-in') {
          router.push('/dashboard');
        } else if (!data.authenticated && pathname !== '/sign-in') {
          router.push('/sign-in');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (pathname !== '/sign-in') {
          router.push('/sign-in');
        }
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [router, pathname]);

  return { isCheckingAuth };
}