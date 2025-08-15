"use client"

import { apolloClient } from "./appolo-client"


export const setIsAuthenticated = (value: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("isAuthenticated", value.toString())
  }
}

export const getIsAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isAuthenticated") === "true"
  }
  return false
}

export const removeIsAuthenticated = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAuthenticated")
  }
}

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    // Set secure cookie with httpOnly-like protection
    document.cookie = `token=${token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}` // 7 days
    // Reset Apollo Client cache to refetch with new token
    apolloClient.resetStore()
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";")
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("token="))
    return tokenCookie ? tokenCookie.split("=")[1] : null
  }
  return null
}

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // Clear Apollo Client cache on logout
    apolloClient.clearStore()
  }
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
