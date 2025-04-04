"use client";

import client from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import "./globals.css";
import { useAuthRedirect } from "@/app/hooks/useAuthRedirect";
import Head from "next/head";
import { useViewportRestrictions } from "@/app/hooks/useViewportRestrictions";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isCheckingAuth } = useAuthRedirect();
  useViewportRestrictions(320);

  if (isCheckingAuth) {
    return (
      <html lang="en">
        <body className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading application...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="min-w-[320px]">
      <Head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" 
        />
      </Head>
      <body className="min-w-[320px] overflow-x-hidden">
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}