"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (data: any) => void;
  onToggleMode: () => void;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

export function AuthForm({ mode, onSubmit, onToggleMode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let submitData;
    if (isSignup) {
      // SignupInput: username, email, password
      submitData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
    } else {
      // LoginInput: email, password
      submitData = {
        email: formData.email,
        password: formData.password,
      };
    }

    onSubmit(submitData);

    // Simulate successful auth and redirect to chat
    setTimeout(() => {
      router.push("/chat");
    }, 500);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
        <AuthButton onClick={() => {}}>{isSignup ? "Create Account" : "Sign In"}</AuthButton>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm font-medium"
        >
          {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </button>
      </div>
    </form>
  );
}
