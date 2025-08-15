"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { removeAuthToken, getAuthToken, setAuthToken } from "@/lib/auth"
import { useApolloClient } from "@apollo/client"
import type { User, AuthPayload, LoginInput, SignupInput } from "@/types/chat"
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "@/graphql/mutations"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (input: LoginInput) => Promise<AuthPayload>
  signup: (input: SignupInput) => Promise<AuthPayload>
  logout: () => void
  setUserOnlineStatus: (isOnline: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const apolloClient = useApolloClient()

  // Check for existing token on mount
  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      // We'll fetch user data when needed, not immediately
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (input: LoginInput): Promise<AuthPayload> => {
    try {
      console.log("login input from the auth context",input);
      
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input },
      })

      console.log(data,"data from the login context");
      console.log(data.user,"data user from the login context");
      

      if (data?.login) {
        const authPayload = data.login
        setAuthToken(authPayload.token)
        setUser(authPayload.user)
        return authPayload
      }

      throw new Error("Login failed")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (input: SignupInput): Promise<AuthPayload> => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { input },
      })

      if (data?.signup) {
        const authPayload = data.signup
        setAuthToken(authPayload.token)
        setUser(authPayload.user)
        return authPayload
      }

      throw new Error("Signup failed")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
  }

  const setUserOnlineStatus = async (isOnline: boolean) => {
    console.log("Set user online status:", isOnline)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    setUserOnlineStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
