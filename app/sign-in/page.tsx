"use client";

import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

// 1. Define proper TypeScript interfaces
interface LoginData {
  login: {
    user: {
      id: string;
      name: string;
    };
  };
}

interface LoginVariables {
  email: string;
  password: string;
}

// 2. GraphQL mutation with proper typing
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
      }
    }
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // 3. Type-safe mutation hook
  const [login, { loading, error }] = useMutation<LoginData, LoginVariables>(
    LOGIN_MUTATION,
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onCompleted: (data) => {
        router.push("/dashboard");
        router.refresh();
      },
      onError: (err) => {
        toast.error("Login failed. Please check your credentials.");
        console.error("Login error:", err);
      },
    }
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ variables: { email, password } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
          
          {/* 4. Display GraphQL errors if they exist */}
          {error && (
            <div className="p-2 mt-4 text-sm text-red-600 bg-red-50 rounded-md">
              {error.message}
            </div>
          )}
        </div>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link 
              href="/sign-up" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}