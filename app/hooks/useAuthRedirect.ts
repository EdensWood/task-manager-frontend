// app/hooks/useAuthRedirect.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useAuthRedirect() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionCookie = Cookies.get("taskmanager.sid"); // Check for session cookie
    if (sessionCookie) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/sign-in"); // Redirect to login if not authenticated
    }
  }, [router]);

  return { isAuthenticated };
}