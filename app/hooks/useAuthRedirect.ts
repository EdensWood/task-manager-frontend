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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-session`, {
          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        
        if (!res.ok || !data.authenticated) {
          if (pathname !== '/sign-in') {
            router.push('/sign-in');
          }
          return;
        }

        if (pathname === '/sign-in') {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Auth check failed:", error);
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