/* eslint-disable @typescript-eslint/no-namespace */
// lib/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
    }
  }
}