"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";

import { useAuth } from "@/contexts/auth-context";
import { setAuthToken, setIsAuthenticated } from "@/lib/auth";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "@/graphql/mutations";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";

interface AuthFormProps {
  mode: "login" | "signup";
  onToggleMode: () => void;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const { setUser } = useAuth(); 

  // GraphQL mutations and queries
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (isSignup && !formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (isSignup && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 5000);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isSignup) {
        console.log("[v0] Attempting signup...");
        const { data } = await signupMutation({
          variables: {
            input: {
              username: formData.username,
              email: formData.email,
              password: formData.password,
            },
          },
        });

        console.log("[v0] Signup response:", data);
        if (data?.signup) {
          const authPayload = data.signup;
          console.log("[v0] Setting token and user:", authPayload);
          setAuthToken(authPayload.token);
          setIsAuthenticated(true);
          setUser(authPayload.user);
          router.push("/chat");
        }
      } else {
        console.log("[v0] Attempting login...");
        const { data } = await loginMutation({
          variables: {
            input: {
              email: formData.email,
              password: formData.password,
            },
          },
        });

        console.log("[v0] Login response:", data);
        if (data?.login) {
          const authPayload = data.login;
          console.log("[v0] Setting token and user:", authPayload);
          setAuthToken(authPayload.token);
          setIsAuthenticated(true);
          setUser(authPayload.user);
          router.push("/chat");
        }
      }
    } catch (error: any) {
      console.error("[v0] Auth error:", error);

      // Handle GraphQL errors
      const errorMessage =
        error?.graphQLErrors?.[0]?.message || error?.networkError?.message || error?.message || "Authentication failed. Please try again.";

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{errors.general}</p>
        </div>
      )}

      {isSignup && (
        <AuthInput
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(value) => updateField("username", value)}
          error={errors.username}
        />
      )}

      <AuthInput type="email" placeholder="Email" value={formData.email} onChange={(value) => updateField("email", value)} error={errors.email} />

      <AuthInput
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(value) => updateField("password", value)}
        error={errors.password}
      />

      <div className="pt-2">
        <AuthButton onClick={() => {}} disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isSignup ? "Creating Account..." : "Signing In..."}
            </div>
          ) : isSignup ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </AuthButton>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onToggleMode}
          disabled={isLoading}
          className="text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
        >
          {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </button>
      </div>
    </form>
  );
}
