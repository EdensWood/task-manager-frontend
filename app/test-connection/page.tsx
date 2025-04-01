// app/test-connection/page.tsx
"use client";
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { toast } from "react-hot-toast";

const TEST_QUERY = gql`
  query TestConnection {
    __typename
  }
`;

export default function TestConnectionPage() {
  const { loading, error } = useQuery(TEST_QUERY);

  useEffect(() => {
    if (error) {
      console.error("Connection Error:", error);
      toast.error(`Failed to connect to backend: ${error.message}`);
    } else if (!loading) {
      toast.success("Successfully connected to backend!");
    }
  }, [loading, error]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Testing Backend Connection</h1>
        {loading && <p>Connecting...</p>}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error.message}</p>
            <p className="mt-2">Please check:</p>
            <ul className="list-disc list-inside text-left">
              <li>Is the backend server running?</li>
              <li>Is it accessible at http://localhost:4000/graphql?</li>
              <li>Are there any CORS issues?</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}