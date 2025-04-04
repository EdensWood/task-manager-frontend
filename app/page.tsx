// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/app/hooks/useAuthRedirect";

export default function HomePage() {
  const router = useRouter();
  const { isCheckingAuth } = useAuthRedirect();

  useEffect(() => {
    // Only redirect when auth check is complete
    if (!isCheckingAuth) {
      router.push("/dashboard"); // Default to dashboard if auth is complete
    }
  }, [isCheckingAuth, router]);

  // Show loading state during initial auth check
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return null; // Redirection will happen automatically
}