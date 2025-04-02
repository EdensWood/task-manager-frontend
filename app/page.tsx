// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/app/hooks/useAuthRedirect";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthRedirect();

  useEffect(() => {
    // Redirect logic
    if (isAuthenticated === true) {
      router.push("/dashboard");
    } else if (isAuthenticated === false) {
      router.push("/signin");
    }
    // isAuthenticated will be null during initial check
  }, [isAuthenticated, router]);

  // Show loading state during initial auth check
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return null; // Redirection will happen automatically
}