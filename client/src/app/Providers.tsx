"use client";

import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/contexts/auth-context";
import { apolloClient } from "@/lib/appolo-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
}
