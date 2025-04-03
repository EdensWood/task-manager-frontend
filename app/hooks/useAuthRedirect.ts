"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-session`, {
          method: "GET",
          credentials: "include", // ✅ Send cookies with request
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/sign-in"); // Redirect if not authenticated
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        router.push("/sign-in");
      }
    }

    checkAuth();
  }, [router]);

  return { isAuthenticated };
}
