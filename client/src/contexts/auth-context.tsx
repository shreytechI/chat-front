"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { removeAuthToken, getAuthToken, setAuthToken, getIsAuthenticated, removeIsAuthenticated } from "@/lib/auth";
import { useApolloClient, useQuery } from "@apollo/client";
import type { User, AuthPayload, LoginInput, SignupInput } from "@/types/chat";
import { LOGIN_MUTATION, SET_USER_ONLINE_MUTATION, SIGNUP_MUTATION } from "@/graphql/mutations";
import { ME_QUERY } from "@/graphql/queries";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthPayload>;
  signup: (input: SignupInput) => Promise<AuthPayload>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setUserOnlineStatus: (isOnline: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const apolloClient = useApolloClient();

  const token = getAuthToken();
  const isAuthenticatedFlag = getIsAuthenticated();

  const { data: userData, refetch } = useQuery(ME_QUERY, {
    skip: !token || !isAuthenticatedFlag, // Skip if no token or not authenticated
    fetchPolicy: "cache-and-network", // Always try to fetch fresh data
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error("ME_QUERY error:", error);
      // If token is invalid remove it and authentication flag
      removeAuthToken();
      removeIsAuthenticated();
      setUser(null);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (!token || !isAuthenticatedFlag) {
      setLoading(false);
      setUser(null);
    } else {
      // If token exists and authenticated but query was skipped, refetch
      if (!userData && token && isAuthenticatedFlag) {
        refetch();
      }
    }
  }, [token, isAuthenticatedFlag, userData, refetch]);

  const login = async (input: LoginInput): Promise<AuthPayload> => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input },
      });

      if (data?.login) {
        const authPayload = data.login;
        setAuthToken(authPayload.token);
        setUser(authPayload.user);
        return authPayload;
      }

      throw new Error("Login failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (input: SignupInput): Promise<AuthPayload> => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { input },
      });

      if (data?.signup) {
        const authPayload = data.signup;
        setAuthToken(authPayload.token);
        setUser(authPayload.user);
        return authPayload;
      }

      throw new Error("Signup failed");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const setUserOnlineStatus = async (isOnline: boolean) => {
    if (!user) return;

    try {
      await apolloClient.mutate({
        mutation: SET_USER_ONLINE_MUTATION,
        variables: { isOnline },
      });

      // Update local user state
      setUser((prev) => (prev ? { ...prev, isOnline } : null));
    } catch (error) {
      console.error("[v0] Error setting user online status:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    setUser,
    setUserOnlineStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
